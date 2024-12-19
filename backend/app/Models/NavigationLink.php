<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class NavigationLink extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'label',
        'order',
        'url',
        'linkable_type',
        'linkable_id',
        'navigation_id',
    ];

    public array $types = [
        'blog_post' => BlogPost::class,
        'external' => 'external',
    ];

    public array $labelTypes = [
        'blog_post' => 'Postagem',
        'external' => 'Link Externo',
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function navigation(): BelongsTo
    {
        return $this->belongsTo(Navigation::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'linkable_id');
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getUrlAttribute()
    {
        $type = $this->linkable_type;
        if (is_null($type) || $type === 'external') {
            return $this->getRawOriginal('url');
        }

        $model = $this->post;

        return $model?->route?->url;
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getNextOrder($navigationId): int
    {
        $lastOrder = $this->select('order')
            ->where('navigation_id', $navigationId)
            ->orderBy('order', 'desc')
            ->first();

        return $lastOrder ? $lastOrder->order + 1 : 0;
    }

    public function isExternal(): bool
    {
        $url = $this->url;

        if (str_contains($url, 'www') || str_contains($url, 'https') || str_contains($url, 'http')) {
            if (!str_contains(url(''), $url)) {
                return true;
            }
        }

        return false;
    }
}
