<?php

namespace App\Observers\Product;

use App\Models\Attribute;

class AttributeObserver
{
    public function created(Attribute $attribute)
    {
        $category = $attribute->category;

        if ($category->products && count($category->products)) {
            foreach ($category->products as $product) {
                $product->pAttributes()->attach($attribute, ['order' => $attribute->order]);
            }
        }
    }

    public function updated(Attribute $attribute)
    {
        if ($attribute->isDirty('order') && $attribute->products && count($attribute->products)) {
            foreach ($attribute->products as $product) {
                $attribute->products()->updateExistingPivot(
                    $product->id, ['order' => $attribute->order]
                );
            }
        }
    }

    public function deleting(Attribute $attribute)
    {
        if ($attribute->products && count($attribute->products)) {
            foreach ($attribute->products as $product) {
                $attribute->products()->detach($product->id);
            }
        }
    }
}
