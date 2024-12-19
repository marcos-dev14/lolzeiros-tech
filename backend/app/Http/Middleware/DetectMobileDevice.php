<?php

namespace App\Http\Middleware;

use Closure;
use Jenssegers\Agent\Agent;

class DetectMobileDevice
{
    public function handle($request, Closure $next)
    {
        $agent = new Agent();

        $forceMobile = config('custom.force_mobile');
        $isMobile = $forceMobile || $agent->isMobile();

        view()->share('isMobile', $isMobile);

        return $next($request);
    }
}
