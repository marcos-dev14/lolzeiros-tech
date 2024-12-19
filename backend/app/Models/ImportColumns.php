<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportColumns extends Model
{
    use HasFactory;

    const AVAILABLE_COLUMNS = [
        'title' => 'Título',
        'searcheable' => 'Título Invisível',
        'primary_text' => 'Postagem Principal',
        'secondary_text' => 'Postagem Secundária',
        'reference' => 'Referência',
        'ean13' => 'EAN13',
        'display_code' => 'Código do Display',
        'dun14' => 'DUN14',
        'expiration_date' => 'Data de validade',
        'origin' => 'Origem',
        'release_year' => 'Lançamento',
        'catalog_name' => 'Nome do Catálogo',
        'catalog_page' => 'Página no Catálogo',
        'gender' => 'Gênero',
        'embed_product' => 'Looping de Produto',
        'product_attributes' => 'Atributos Produto',
        'product_variations' => 'Opcionais de Produto',
        'product_related' => 'Produtos Relacionados',
        'seo_title' => 'Título do SEO',
        'seo_description' => 'Descrição do SEO',
        'size_height' => 'Produto Altura',
        'size_width' => 'Produto Largura',
        'size_length' => 'Produto Comprimento',
        'size_cubic' => 'Produto Cubagem',
        'size_weight' => 'Produto Peso',
        'packing_type' => 'Tipo de embalagem do produto',
        'box_height' => 'Caixa Altura',
        'box_width' => 'Caixa Largura',
        'box_length' => 'Caixa Comprimento',
        'box_cubic' => 'Caixa Cubagem',
        'box_weight' => 'Caixa Peso',
        'box_packing_type' => 'Tipo de embalagem da caixa',
        'unit_price' => 'Preço fracionada',
        'unit_price_promotional' => 'Preço promocional fracionada',
        'unit_minimal' => 'Quantidade mínima fracionada',
        'availability' => 'Disponibilidade',
        'expected_arrival' => 'Previsão de chegada da Representada',
        'box_price' => 'Preço caixa fechada',
        'box_price_promotional' => 'Preço promocional caixa fechada',
        'box_minimal' => 'Quantidade mínima caixa',
        'ipi' => 'IPI',
        'ncm' => 'NCM',
        'cst' => 'CST',
        'icms' => 'ICMS',
        'cfop' => 'CFOP',
        'packaging' => 'Embalagem',
        'certification' => 'Certificação',
        'age_group' => 'Faixa Etária',
        'category' => 'Categoria',
        'brand' => 'Marca',
        'badge' => 'Imagem de Destaque',
    ];

    protected $fillable = [
        'field_name',
        'column',
        'import_id',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function import(): BelongsTo
    {
        return $this->belongsTo(Import::class);
    }
}
