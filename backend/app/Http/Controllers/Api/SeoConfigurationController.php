<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SeoConfigurationController extends BaseController
{
    protected array $availableFields = [];

    public function __construct()
    {
        $this->availableFields = [
            'site_name',
            'page_title',
            'logo',
            'domain',
            'seo_description',
            'seo_keywords',
            'script_facebook_pixel',
            'script_google_ads',
            'script_google_analytics',
            'scripts_general',
            'cellphone',
            'phone',
            'whatsapp',
            'social_instagram',
            'social_facebook',
            'social_youtube',
            'social_twitter',
            'color_primary',
            'color_highlight',
            'color_highlight2',
            'color_highlight3',
            'theme',
        ];
    }

    protected function getConfigData()
    {
        return Cache::get('SEO_CONFIG') ?? Cache::rememberForever('SEO_CONFIG', fn () => config('seo_config'));
    }

    public function show(): JsonResponse
    {
        $config = $this->getConfigData();
        $config['available_themes'] = [
            ['label' => 'Padrão', 'value' => 'default'],
            ['label' => 'Dia dos Namorados', 'value' => 'valentines-day'],
            ['label' => 'Natal', 'value' => 'christmas'],
        ];

        return $this->sendResponse($config, 'Configurações encontradas');
    }

    public function update(Request $request): JsonResponse
    {
        $config = $this->getConfigData();

        foreach ($request->only($this->availableFields) as $key => $item) {
            $config[$key] = $item;
        }

        $this->storeConfigFile($config);
        $this->cacheClear();

        return $this->sendResponse($this->getConfigData(), 'Configurações encontradas');
    }

    protected function storeConfigFile($config): void
    {
        file_put_contents(
            base_path().'/config/seo_config.php',
            "<?php\n\nreturn ".var_export($config, true).";\n"
        );
    }

    protected function cacheClear(): void
    {
        Cache::forget('SEO_CONFIG');
        Artisan::call('config:cache');
        Cache::rememberForever('SEO_CONFIG', fn () => config('seo_config'));
        exec('npm run dev');
    }

    public function storeImage(Request $request, string $imageName): JsonResponse
    {
        $config = $this->getConfigData();

        if (! $request->hasFile($imageName)) {
            return $this->sendResponse([], null, 400);
        }

        $image = $request->file($imageName);

        if (! $image->isValid()) {
            return $this->sendResponse([], 'Arquivo de image inválido.', 400);
        }

        $path = "seo_images/$imageName/";
        $newName = "{$imageName}_".time().'.'.$image->getClientOriginalExtension();

        $config[$imageName] = $newName;
        $this->storeConfigFile($config);
        $this->cacheClear();

        Storage::deleteDirectory($path);
        Storage::putFileAs($path, $image, $newName);

        return $this->sendResponse($this->getConfigData(), "Imagem $imageName enviada com sucesso");
    }

    public function destroyImage(string $imageName): JsonResponse
    {
        if (Storage::exists("seo_images/$imageName")) {
            Storage::deleteDirectory("seo_images/$imageName");
        }

        $config = $this->getConfigData();
        $config[$imageName] = null;

        $this->storeConfigFile($config);
        $this->cacheClear();

        return $this->sendResponse($this->getConfigData(), "Imagem $imageName removida com sucesso");
    }
}
