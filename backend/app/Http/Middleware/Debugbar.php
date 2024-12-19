<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class Debugbar
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(Request): (Response|RedirectResponse|JsonResponse|BinaryFileResponse) $next
     * @return Response|JsonResponse|RedirectResponse|BinaryFileResponse
     */
    public function handle(Request $request, Closure $next): Response|JsonResponse|RedirectResponse|BinaryFileResponse
    {
        $response = $next($request);

        // Check if the response is a BinaryFileResponse and return it immediately if true
        if ($response instanceof BinaryFileResponse) {
            return $response;
        }

        // Process the response if it is a JsonResponse and Debugbar is enabled
        if (
            $response instanceof JsonResponse &&
            app()->bound('debugbar') &&
            app('debugbar')->isEnabled() &&
            (is_object($response->getData()) || is_array($response->getData()))
        ) {
            $debugbarData = app('debugbar')->getData();

            $queries = $debugbarData['queries'] ?? [];
            $statements = [];

            foreach ($queries['statements'] ?? [] as $idx => $statement) {
                $statements[$idx] = [
                    'query' => $statement['sql'],
                    'file' => $statement['stmt_id']
                ];
            }

            $responseData = [
                '_debugbar' => [
                    'queries' => $queries['nb_statements'] ?? [],
                    'statements' => $statements,
                ],
            ];

            if (is_object($response->getData())) {
                $responseData += $response->getData(true);
            } else {
                $responseData['data'] = $response->getData(true);
            }

            $response->setData($responseData);
        }

        return $response;
    }
}

