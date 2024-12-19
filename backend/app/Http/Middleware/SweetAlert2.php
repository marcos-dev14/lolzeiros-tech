<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SweetAlert2
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (session('success')) {
            alert()->success('Sucesso!!', session('success'));
        }

        if (session('error')) {
            alert()->error('Ooopss!!', session('error'));
        }

        if (session('errorForm')) {
            $html = "<ul>";
            foreach (session('errorForm') as $error) {
                $html .= "<li>$error[0]</li>";
            }
            $html .= "</ul>";

            alert()->html('Erro ao executar a ação!', $html, 'error');
        }

        if (session('errors')) {
            $error = session('errors');

            if (!is_string($error)) {
                $error = $this->getErrors($error->getMessages());
            }

            alert()->error('Ooopss!!', $error);
        }

        return $response;
    }

    /**
     * Get the validation errors
     *
     * @param array $errors
     * @return string
     */
    private function getErrors(array $errors): string
    {
        $errors = collect($errors);
        return $errors->flatten()->implode('<br />');
    }
}
