<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Navigation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'location',
        'title',
        'order',
    ];

    const LOCATION_FOOTER = 'footer';

    const LOCATION_HEADER = 'header';

    public const LOCATIONS = [
        self::LOCATION_HEADER => 'Cabeçalho',
        self::LOCATION_FOOTER => 'Rodapé',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function links(): HasMany
    {
        return $this->hasMany(NavigationLink::class)->orderBy('order');
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getNextOrder($location): int
    {
        $lastOrder = $this->select('order')
            ->where('location', $location)
            ->orderBy('order', 'desc')
            ->first();

        return $lastOrder ? $lastOrder->order + 1 : 0;
    }
}
