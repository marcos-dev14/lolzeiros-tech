<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favoritable extends Model
{
    use HasFactory;

    /**
     * Define o nome da tabela.
     *
     * @var string
     */
    protected $table = 'favoritable';

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'favoritable_type',
        'favoritable_id',
        'seller_id',
        'created_at',
    ];

    /**
     * Relação polimórfica para os modelos que podem ser "favoritados".
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function favoritable()
    {
        return $this->morphTo();
    }

    /**
     * Relação com o modelo Seller.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
}
