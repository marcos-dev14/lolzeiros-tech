<?php

namespace App\Services;

use App\Models\Admin\Banner\Block;
use App\Models\Admin\Banner\Image;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Mavinoo\Batch\Batch;

class BannerImageService extends BaseService
{
    public function __construct(protected Batch $batch)
    {
        $this->model = new Image();
    }

    /**
     * @throws Exception
     */
    public function store(Block $block, array $images, $platform)
    {
        $path = str_replace('{block_id}', $block->id, $this->model::IMAGE_PATH);

        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        $lastOrder = $this->model
            ->where('platform', $platform)
            ->where('block_id', $block->id)
            ->max('order');
        $lastOrder = $lastOrder + 1 ?? 1;

        try {
            foreach ($images as $image) {
                $extension = $image->getClientOriginalExtension();

                $label = str_replace(".$extension", '', $image->getClientOriginalName());
                $label = str_replace("-", ' ', $label);
                $label = str_replace("_", ' ', $label);
                $label = ucwords(mb_strtolower($label));

                $name =  Str::slug($label) . '-' . rand(1111, 9999) . ".$extension";
                Storage::putFileAs($path, $image, $name);

                $uploadedImage = [
                    'name' => $name,
                    'label' => $label,
                    'order' => $lastOrder,
                    'block_id' => $block->id,
                    'platform' => $platform
                ];

                $bannerImage = new $this->model($uploadedImage);
                $bannerImage->save();

                $lastOrder++;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public function updateOrder(array $images = []): bool|int
    {
        return $this->batch->update($this->model, $images, 'id');
    }
}
