<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(\Illuminate\Http\Request): (Response|RedirectResponse|JsonResponse|BinaryFileResponse) $next
     * @return Response|RedirectResponse|JsonResponse|BinaryFileResponse
     */
    public function handle(Request $request, Closure $next): Response|RedirectResponse|JsonResponse|BinaryFileResponse
    {
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}

