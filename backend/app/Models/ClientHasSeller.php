<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientHasSeller extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'client_has_seller';

    protected $fillable = [
        'client_group_id',
        'seller_id',
        'supplier_id',
    ];

    /**
     * Relacionamentos
     * 
     *
     */
    public function clientGroup()
    {
        return $this->belongsTo(ClientGroup::class, 'client_group_id', 'id');
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class ,'seller_id', 'id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }
}
