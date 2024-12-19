<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use JetBrains\PhpStorm\Pure;

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @param $result
     * @param $message
     * @param int $code
     * @return JsonResponse
     */
    public function sendResponse($result, $message, int $code = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $result,
            'message' => $message,
        ];

        return response()->json($response, $code);
    }

    /**
     * return error response.
     *
     * @param $error
     * @param array<string, null> $errorMessages
     * @param int $code
     * @return JsonResponse
     */
    public function sendError($error, array $errorMessages = [], int $code = 500): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error,
            'response' => [
                'data' => [
                    'message' => $error
                ]
            ]
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        if (config('app.env') === 'production') {
            Log::error($error == 'Error validation' ? $errorMessages[0] ?? $errorMessages : $error);
        }

        return response()->json($response, $code ?? 500);
    }

    protected function getExceptionCode(\Exception|\TypeError|\Error $exception): int
    {
        $code = $exception->getCode();

        return (is_int($code) && $code !== 0) ? $code : 500;
    }
}
