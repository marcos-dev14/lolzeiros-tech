<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use JetBrains\PhpStorm\NoReturn;

class UserController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private User $_model,
        private ImageService $_imageService
    ){}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->latest();

        if ($request->paginated == 'true') {
            $users = $builder->paginate();

            return $this->sendResponse(
                UserResource::collection($users)->response()->getData(),
                'Usuários encontrados.'
            );
        }

        $users = $builder->get();

        return $this->sendResponse(UserResource::collection($users), 'Usuário encontrado.');
    }

    public function show($id): JsonResponse
    {
        $user = $this->_model->find($id);

        if (is_null($user)) {
            return $this->sendError('Usuário não existe', [], 404);
        }

        return $this->sendResponse(new UserResource($user), 'Usuário encontrado');
    }

    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable()) + ['password_confirmation' => $request->password_confirmation];
        $validator = Validator::make($requestFields, [
            'avatar' => 'mimes:jpeg,jpg,png',
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                'confirmed',
                Password::min(6)->letters()->numbers()->mixedCase()->symbols()
            ]
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        unset($requestFields['password_confirmation']);
        $requestFields['password'] = bcrypt($requestFields['password']);

        $user = $this->_model->fill($requestFields);
        $user->save();

        if ($request->file('avatar')) {
            $avatar = $this->uploadAvatar($request->file('avatar'), $user);
            $user->update(['avatar' => $avatar]);
        }

        return $this->sendResponse(new UserResource($user), 'Usuário adicionado com sucesso.');
    }

    protected function uploadAvatar(UploadedFile $file, User $user): string
    {
        $oldImage = $user->avatar;
        $newName = 'avatar-' . Str::slug($user->name);
        $path = str_replace("{id}", $user->id, $this->_model::AVATAR_PATH);

        $avatar = $this->_imageService->upload(
            file: $file,
            path: $path,
            dimensions: $this->_model::AVATAR_DIMENSIONS,
            name: $newName,
            hasThumb: false
        );

        if (!is_null($oldImage) && $oldImage !== "$newName.jpg") {
            $this->_imageService->destroy($user->avatar_path, $oldImage);
        }

        return $avatar['name'];
    }

    public function update(Request $request, $userId): JsonResponse
    {
        $user = $this->_model->find($userId);

        if (!$user) {
            return $this->sendError('Usuário não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable()) + ['password_confirmation' => $request->password_confirmation];
        $validator = Validator::make($requestFields, [
            'avatar' => 'mimes:jpeg,jpg,png',
            'email' => 'email',
            'password' => [
                'confirmed',
                Password::min(6)->letters()->numbers()->mixedCase()->symbols()
            ]
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        if (!empty($requestFields['password'])) {
            $requestFields['password'] = bcrypt($requestFields['password']);
        } else {
            unset($requestFields['password']);
        }

        if (!empty($requestFields['name']) && $requestFields['name'] != $user->name) {
            $user->name = $requestFields['name'];
        }

        if ($request->file('avatar')) {
            $requestFields['avatar'] = $this->uploadAvatar($request->file('avatar'), $user);
        }

        $user->update($requestFields);

        return $this->sendResponse(new UserResource($user), 'Usuário atualizado.');
    }

    public function destroy($userId): JsonResponse
    {
        if ($userId == 1) {
            return $this->sendError('Este usuário não pode ser removido.', ['error' => 'Permission'], 401);
        }

        $user = $this->_model->find($userId);

        if (!$user) {
            return $this->sendError('Usuário não encontrado', [], 404);
        }

        $user->delete();

        return $this->sendResponse([], 'Usuário removido');
    }
}
