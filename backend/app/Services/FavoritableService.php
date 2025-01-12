<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Order;
use App\Models\Favoritable;

class FavoritableService
{
    /**
     * Adiciona um item aos favoritos.
     *
     * @param string $type
     * @param int $id
     * @param int $sellerId
     * @return array
     */
    public function addFavoritable(string $type, int $id, int $sellerId): array
    {
        $item = $type === 'Client' 
            ? Client::find($id) 
            : Order::find($id);

        if (!$item) {
            return [
                'success' => false,
                'message' => 'Item não encontrado.',
            ];
        }

        $favoritable = new Favoritable();
        $favoritable->favoritable()->associate($item); 
        $favoritable->seller_id = $sellerId; 
        $favoritable->save();

        return [
            'success' => true,
            'message' => 'Item favoritado com sucesso.',
        ];
    }

    /**
     * Remove um item dos favoritos.
     *
     * @param string $type
     * @param int $id
     * @param int $sellerId
     * @return array
     */
    public function removeFavoritable(string $type, int $id, int $sellerId): array
    {
        $favoritable = Favoritable::where('seller_id', $sellerId)
            ->where('favoritable_type', $type === 'Client' ? Client::class : Order::class)
            ->where('favoritable_id', $id)
            ->first();

        if (!$favoritable) {
            return [
                'success' => false,
                'message' => 'Favorito não encontrado.',
            ];
        }

        $favoritable->delete();

        return [
            'success' => true,
            'message' => 'Item removido dos favoritos com sucesso.',
        ];
    }
}
