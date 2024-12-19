<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AuthResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\BaseController as BaseController;

class AuthController extends BaseController
{
    public function login(Request $request): JsonResponse
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $authUser = Auth::user();
            $success['token'] = $authUser->createToken('MyAuthApp')->plainTextToken;
            $success['user'] = $authUser;

            return $this->sendResponse(new AuthResource($success), 'Usuário conectado');
        } else {
            return $this->sendError(
                "Login não autorizado com os dados {email: \"$request->email\", password: \"$request->password\"}",
                 ['error' => 'Unauthorised'],
            401);
        }
    }

    public function logout(): JsonResponse
    {
        Auth::user()->tokens()->delete();

        return $this->sendResponse(null, 'Desconectado');
    }
}
