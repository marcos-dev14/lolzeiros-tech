<?php

namespace App\Observers;

use App\Models\NavigationLink;
use Illuminate\Support\Facades\Cache;

class NavigationLinkObserver
{
    /**
     * Handle the NavigationLink "created" event.
     *
     * @param NavigationLink $navigationLink
     * @return void
     */
    public function created(NavigationLink $navigationLink): void
    {
        $navigation = $navigationLink->navigation;
        Cache::forget(strtoupper("NAVIGATION_$navigation?->location"));
    }

    /**
     * Handle the NavigationLink "updated" event.
     *
     * @param NavigationLink $navigationLink
     * @return void
     */
    public function updated(NavigationLink $navigationLink): void
    {
        $navigation = $navigationLink->navigation;
        Cache::forget(strtoupper("NAVIGATION_$navigation?->location"));
    }

    /**
     * Handle the NavigationLink "deleted" event.
     *
     * @param NavigationLink $navigationLink
     * @return void
     */
    public function deleted(NavigationLink $navigationLink): void
    {
        $navigation = $navigationLink->navigation;
        Cache::forget(strtoupper("NAVIGATION_$navigation?->location"));
    }
}
