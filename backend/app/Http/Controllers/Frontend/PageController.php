<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Brand;
use App\Models\Supplier;
use Illuminate\View\View;
use JetBrains\PhpStorm\NoReturn;

class PageController extends BaseController
{
    #[NoReturn]
    public function __construct()
    {
        parent::__construct();
    }

    public function industry(): View
    {
        $this->setPageSeo((object) ['title' => 'Indústrias']);

        $suppliers = Supplier::isAvailable()->whereHas('availableProducts')
            ->select('id', 'name', 'image', 'blog_post_id')
            ->withCount('availableProducts')
            ->get();

        return view('pages.suppliers', compact('suppliers'));
    }

    public function brands(): View
    {
        $this->setPageSeo((object) ['title' => 'Marcas']);

        $brands = Brand::select(['id', 'name', 'slug', 'image'])
            ->whereNotNull('image')
            ->whereHas('availableProducts')
            ->withCount('availableProducts')
            ->orderBy('name')
            ->get();

        return view('pages.brands', compact('brands'));
    }
}
