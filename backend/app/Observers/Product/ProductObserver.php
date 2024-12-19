<?php

namespace App\Observers\Product;

use App\Enums\Product\AvailabilityType;
use App\Models\Product;
use App\Services\RouteService;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;

class ProductObserver
{
    public function __construct(private RouteService $_routeService) {}

    public function creating(Product $product): void
    {
        if (!empty($product->unit_price) && !empty($product->unit_minimal)) {
            $product->unit_subtotal = $product->unit_price * $product->unit_minimal;
        }

        if (!empty($product->box_price) && !empty($product->box_minimal)) {
            $product->box_subtotal = $product->box_price * $product->box_minimal;
        }

        if (empty($product->availability)) {
            $product->availability = AvailabilityType::AVAILABLE;
        }

        $product->size_cubic = ($product->size_height * $product->size_width * $product->size_length);
        $product->box_cubic = ($product->box_height * $product->box_width * $product->box_length);

        if (is_null($product->published_at)) {
            $product->published_at = Carbon::now();
        }

        if (is_null($product->featured_until)) {
            $product->featured_until = Carbon::now()->addDays(7);
        }
    }

    /**
     * @throws Exception
     */
    public function created(Product $product): void
    {
        $generatedUrl = $product->generateUrl();
        $this->_routeService->store(
            $product,
            $this->_routeService->generateUniqueUrlByString($product, $generatedUrl)
        );
    }

    /**
     * @throws Exception
     */
    public function updating(Product $product): void
    {
        if (!empty($product->title) && empty($product->seo_title)) {
            $product->seo_title = Str::limit($product->title, 56, '');
        }

        if (!empty($product->unit_price) && !empty($product->unit_minimal)) {
            $product->unit_subtotal = $product->unit_price * $product->unit_minimal;
        }

        if (!empty($product->box_price) && !empty($product->box_minimal)) {
            $product->box_subtotal = $product->box_price * $product->box_minimal;
        }

        if ($product->route == null) {
            dd('rota');
            $generatedUrl = $product->generateUrl();
            $this->_routeService->store(
                $product,
                $this->_routeService->generateUniqueUrlByString($product, $generatedUrl)
            );
        }

        $product->size_cubic = ($product->size_height * $product->size_width * $product->size_length);
        $product->box_cubic = ($product->box_height * $product->box_width * $product->box_length);
    }

    public function updated(Product $product): void
    {
        self::dispatchAttributeCategoryDirty($product);

        self::changeSupplierUpdatedAtField($product);
    }

    protected function dispatchAttributeCategoryDirty(Product $product): void
    {
        if (!$product->isDirty('attribute_category_id')) {
            return;
        }

        $attributeCategory = $product->attributeCategory;

        if (!$attributeCategory) {
            self::detachAllProductAttributesFromProduct($product);
            return;
        }

        $attributeCategory->load('attributes');

        if (!count($attributeCategory->attributes)) {
            return;
        }

        self::detachAllProductAttributesFromProduct($product);

        foreach ($attributeCategory->attributes->sortBy('order') as $attribute) {
            $product->pAttributes()->attach($attribute, [
                'order' => $attribute->order,
                'value' => $attribute->values
            ]);
        }
    }

    protected function changeSupplierUpdatedAtField(Product $product): void
    {
        $supplier = $product->supplier;
        $lastUpdate = $supplier->updated_at;

        if ($lastUpdate->lt(now()->addMinutes(-30))) {
            $supplier?->update(['updated_at' => Carbon::now()]);
        }
    }

    public function deleting(Product $product): void
    {
        self::deleteProductRelations($product);

        self::detachAllProductAttributesFromProduct($product);
    }

    protected static function deleteProductRelations(Product $product): void
    {
        $relations = ['pAttributes', 'images', 'files', 'variations'];

        foreach ($relations as $relation) {
            if (count($product->$relation)) {
                $product->$relation->each(function ($item) {
                    $item?->delete();
                });
            }
        }

        $product->route?->delete();
    }

    protected static function detachAllProductAttributesFromProduct(Product $product): void
    {
        $product->pAttributes()->detach();
    }
}
