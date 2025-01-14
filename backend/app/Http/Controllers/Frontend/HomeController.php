<?php

namespace App\Http\Controllers\Frontend;

use App\Models\BlogPost;
use App\Models\Brand;
use App\Services\BannerService;
use Illuminate\View\View;

class HomeController extends BaseController
{
    public function __construct(protected BannerService $bannerService) {
        parent::__construct();
    }

    public function index(): View
    {
        $brands = Brand::select(['id', 'name', 'slug', 'image'])
            ->whereNotNull('image')
            ->whereHas('availableProducts')
            ->withCount('availableProducts')
            ->orderBy('name')
            ->take(24)
            ->get();

        $suppliers = session('filters.suppliers.available') ?? $this->getSuppliers();

        $blogPosts = BlogPost::with('category', 'images', 'route')
            ->published()
            ->latest()
            ->take(3)
            ->get();

        $this->bannerService->relations = ['desktopImages', 'mobileImages'];
        $banners = $this->bannerService->all(false);
        $banner1 = $banners->shift();
        $banner2 = $banners->shift();
        $banner3 = $banners->shift();
        $banner4 = $banners->shift();
        $banner5 = $banners->shift();

        $this->setPageSeo();

        return view('pages.home', compact(
            'suppliers',
            'brands',
            'blogPosts',
            'banner1',
            'banner2',
            'banner3',
            'banner4',
            'banner5'
        ));
    }
}
