<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image as InterFacade;
use JetBrains\PhpStorm\ArrayShape;

class ImageService
{
    public function uploadMany(
        array  $files,
        string $path,
        string $dimensions,
        string $name = null,
        bool   $hasThumb = true,
        bool   $aspectRatio = true
    ): array
    {
        $images = [];

        foreach ($files as $file) {
            $newName = $name ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

            $image = $this->upload(
                $file,
                $path,
                $dimensions,
                "$newName-" . rand(11111, 99999),
                $hasThumb,
                $aspectRatio
            );
            array_push($images, $image);
        }

        return $images;
    }

    #[ArrayShape(['name' => "string", 'dimensions' => "string", 'label' => "null|string"])]
    public function upload(
        UploadedFile $file,
        string       $path,
        string       $dimensions,
        string       $name = null,
        bool         $hasThumb = true,
        bool         $aspectRatio = true
    ): array
    {
        if (config('app.env') !== 'production') {
            $path = "public/$path";
        }

        $dimensions = explode('x', $dimensions);
        $extension = $file->getClientOriginalExtension();

        if ($extension == 'svg') {
            $name = $file->getClientOriginalName();
            $newName = Str::slug(str_replace(".$extension", '', $name)) . ".$extension";
            Storage::putFileAs($path, $file, $newName);
            return ['name' => $newName, 'dimensions' => "$dimensions[0]x$dimensions[1]", 'label' => $name];
        }

        $newName = Str::slug($name ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $newName .= '.jpg';
        $webpName = str_replace('jpg', 'webp', $newName);

        $interventionImage = InterFacade::make($file);
        $interventionImage->resize($dimensions[0], $dimensions[1], function ($constraint) use ($aspectRatio) {
            if ($aspectRatio) $constraint->aspectRatio();
        });

        $responseDimensions = "{$interventionImage->width()}x{$interventionImage->height()}";
        $response = ['name' => $newName, 'dimensions' => $responseDimensions, 'label' => $name];
        Storage::put("$path/$newName", (string)$interventionImage->encode());

        $interventionImage->encode('webp');
        Storage::put("$path/$webpName", (string)$interventionImage->encode());

        if ($hasThumb) {
            $interventionImage->encode('jpg');
            $interventionImage->fit(300, 300, function ($constraint) {
                $constraint->upsize();
            });
            Storage::put("$path/thumbs/$newName", (string)$interventionImage->encode());

            $interventionImage->encode('webp');
            Storage::put("$path/thumbs/$webpName", (string)$interventionImage->encode());
        }

        return $response;
    }

    public function destroy(string $path, string $name)
    {
        $image = "$path/$name";
        $imageWebP = str_replace('.jpg', '.webp', str_replace('.png', '.webp', $image));
        $thumb = "$path/thumbs/$name";
        $thumbWebP = str_replace('.jpg', '.webp', str_replace('.png', '.webp', $thumb));

        if (Storage::exists($image)) Storage::delete($image);
        if (Storage::exists($imageWebP)) Storage::delete($imageWebP);
        if (Storage::exists($thumb)) Storage::delete($thumb);
        if (Storage::exists($thumbWebP)) Storage::delete($thumbWebP);
        if (!Storage::allFiles($path)) Storage::deleteDirectory($path);
    }

}
