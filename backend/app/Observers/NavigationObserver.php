<?php

namespace App\Observers;

use App\Models\Navigation;
use Illuminate\Support\Facades\Cache;

class NavigationObserver
{
    /**
     * Handle the Navigation "created" event.
     *
     * @param Navigation $navigation
     * @return void
     */
    public function created(Navigation $navigation): void
    {
        Cache::forget(strtoupper("NAVIGATION_$navigation->location"));
    }

    /**
     * Handle the Navigation "updated" event.
     *
     * @param Navigation $navigation
     * @return void
     */
    public function updated(Navigation $navigation): void
    {
        Cache::forget(strtoupper("NAVIGATION_$navigation->location"));
    }

    /**
     * Handle the Navigation "deleted" event.
     *
     * @param Navigation $navigation
     * @return void
     */
    public function deleted(Navigation $navigation): void
    {
        Cache::forget(strtoupper("NAVIGATION_$navigation->location"));
    }
}
