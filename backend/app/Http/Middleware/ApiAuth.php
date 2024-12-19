<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        // Obtenha o hash da requisição
        $requestHash = $request->header('Api-Authorization');
        $currentRoute = $request->route()->getName();

        // Obtenha as configurações de hash
        $hashAccessConfig = config('api.hashAccess');

        // Verifique se o hash enviado corresponde a algum hash na configuração
        foreach ($hashAccessConfig as $access) {
            if ($access['hash'] === $requestHash) {
                // Verifique se o hash tem permissão para todos os endpoints
                if (in_array('*', $access['endpoints'])) {
                    return $next($request);
                }

                // Verifique se o hash tem permissão para a rota atual
                foreach ($access['endpoints'] as $route) {
                    if (
                        $route === $currentRoute
                        || (str_ends_with($route, '.*') && str_starts_with($currentRoute, rtrim($route, '.*')))
                    ) {
                        return $next($request);
                    }
                }
            }
        }

        // Retorna uma resposta de acesso negado
        return response()->json(['message' => 'Acesso negado'], 403);
    }
}
