<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProductSearchHistory extends Model
{
    protected $table = 'product_search_history';

    protected $fillable = [
        'term_search', 'searched_at',
        'buyer_id', 'buyer_name', 'buyer_email',
        'role_id', 'role_name',
        'company_name', 'name', 'document',
        'document_status', 'joint_stock',
        'client_group_id', 'client_profile_id',
        'tax_regime_id', 'client_pdv_id',
        'seller_id', 'lead_time_id',
        'client_origin_id',
    ];

    public function scopeRecent($query, $term)
    {
        return $query->select('term_search', DB::raw('MAX(searched_at) as latest_search'))
            ->where('term_search', 'LIKE', "%$term%")
            ->groupBy('term_search')
            ->orderBy('latest_search', 'desc')
            ->take(5);
    }

    public function scopePopular($query)
    {
        return $query->select('term_search')
            ->groupBy('term_search')
            ->orderByRaw('COUNT(*) DESC')
            ->take(5);
    }
}
