<?php

namespace App\Services;

use App\Models\Contracts\HasImageInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Throwable;

abstract class BaseWithImageService extends BaseService
{
    public function __construct(protected ImageService $imageService) {}

    /**
     * @throws Throwable
     */
    public function makeWithImage(array $data): Model
    {
        if (!isset($data['image'])) {
            return $this->make($data);
        }

        $uploadedImage = $data['image'];
        unset($data['image']);

        $item = $this->make($data);

        $image = $this->upload(file: $uploadedImage, entity: $item);
        $this->update($item, ['image' => $image]);

        return $item;
    }

    /**
     * @throws Throwable
     */
    public function updateWithImage(int $id, array $data): bool
    {
        if (!isset($data['image'])) {
            return $this->update($id, $data);
        }

        $uploadedImage = $data['image'];
        unset($data['image']);

        $item = $this->getById($id);

        $image = $this->upload(file: $uploadedImage, entity: $item);
        $newData = $data + ['image' => $image];

        return $this->update($item, $newData);
    }

    /**
     * @throws Throwable
     */
    public function destroyWithImage(int $id, $imageField = 'image')
    {
        $item = self::getById($id);
        throw_if(!$item, ModelNotFoundException::class);

        if ($item->$imageField) {
            $this->destroyOldImage(entity: $item);
            $this->update($id, ['image' => null]);
        }

        $item->delete();
    }

    protected function upload(
        UploadedFile  $file,
        HasImageInterface|Model $entity,
        $newNameField = 'slug',
        $imageField = 'image'
    )
    {
        if (!is_null($entity->$imageField)) {
            $this->destroyOldImage($entity);
        }

        $newName = "image-{$entity->$newNameField}-" . rand(111, 999);
        $path = str_replace("{id}", $entity->id, $entity->IMAGE_PATH);

        $image = $this->imageService->upload(
            file: $file,
            path: $path,
            dimensions: $entity->IMAGE_DIMENSIONS,
            name: $newName,
            hasThumb: false
        );

        return $image['name'];
    }

    protected function destroyOldImage($entity)
    {
        $this->imageService->destroy($entity->getImagePath(), $entity->image);
    }
}
