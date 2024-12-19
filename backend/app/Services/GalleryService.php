<?php

namespace App\Services;

use App\Models\GalleryImage;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use JetBrains\PhpStorm\NoReturn;

class GalleryService
{
    #[NoReturn]
    public function __construct(
        private GalleryImage $_galleryImageModel,
        private ImageService $_imageService
    ){}

    /**
     * @throws Exception
     */
    public function store(
        Model  $imageableInstance,
        array $files,
        string $path,
        string $dimensions,
        string $name = null,
        bool   $hasThumb = true,
        bool   $aspectRatio = true
    ): void
    {
        $images = $this->_imageService->uploadMany(
            files: $files,
            path: $path,
            dimensions: $dimensions,
            name: $name,
            hasThumb: $hasThumb,
            aspectRatio: $aspectRatio
        );

        $lastOrder = $this->_galleryImageModel->search($imageableInstance)->max('order');
        $lastOrder = $lastOrder + 1 ?? 1;

        try {
            foreach ($images as $image) {
                $image['order'] = $lastOrder;

                $galleryImage = new $this->_galleryImageModel($image);
                $imageableInstance->images()->save($galleryImage);

                $lastOrder++;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
    /**
     * @throws Exception
     */
    public function storeMain(
        Model        $imageableInstance,
        UploadedFile $file,
        string       $path,
        string       $dimensions,
        string       $name = null,
        bool         $hasThumb = true,
        bool         $aspectRatio = true
    )
    {
        $uploadedImageData = $this->_imageService->upload(
            file: $file,
            path: $path,
            dimensions: $dimensions,
            name: $name,
            hasThumb: $hasThumb,
            aspectRatio: $aspectRatio,
        );

        try {
            $uploadedImageData['main'] = 1;
            $uploadedImageData['order'] = 0;

            $imageableInstance->images()->where('main', 1)->update(['main' => 0]);

            $galleryImage = new $this->_galleryImageModel($uploadedImageData);
            $imageableInstance->images()->save($galleryImage);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    /**
     * @throws Exception
     */
    public function update(GalleryImage $image, $data)
    {
        try {
            $image->update($data);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public function destroy(string $path, GalleryImage $image)
    {
        $this->_imageService->destroy($path, $image->name);
        $image->delete();
    }

    /**
     * @throws Exception
     */
    public function sort(array $images)
    {
        try {
            foreach ($images as $item) {
                $image = $this->_galleryImageModel->find($item['imageID']);
                $image->update(['order' => $item['imageIndex']]);
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
