<?php

namespace App\Observers\Product;

use App\Models\ProductAttribute;

class ProductAttributeObserver
{
    public function deleted(ProductAttribute $productAttribute)
    {
        $product = $productAttribute->product;

        if ($product->attribute_category_id && !count($product->pAttributes)) {
            $product->update(['attribute_category_id' => null]);
        }
    }
}
