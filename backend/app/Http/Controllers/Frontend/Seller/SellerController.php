<?php

namespace App\Http\Controllers\Frontend\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use App\Models\Client;

class SellerController extends Controller
{ 

    public function __construct(private Seller $entityService)
    {
    }
    public function clients()
    {
        $seller = auth()->guard('seller')->user();
        $this->entityService->relations = ['client'];
        return view('pages.seller.clients', compact('sellers'));
    }

    public function orders()
    {
        return view('pages.seller.orders', compact(''));
    }

}
 