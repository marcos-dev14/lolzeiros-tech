<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class BlogPost extends Model
{
    const IMAGEABLE_PATH = 'blog/gallery/{id}';

    const FILEABLE_PATH = 'blog/files/{id}';

    const BASE_URL = 'blog';

    use SoftDeletes, HasFactory, HasRecursiveRelationships;

    public bool $preventAttrSet = false;

    protected $with = ['route'];

    protected $fillable = [
        'title',
        'slug',
        'searcheable',
        'published_at',
        'featured_until',
        'use_video',
        'youtube_link',
        'primary_text',
        'secondary_text',
        'embed_type',
        'embed_id',
        'seo_title',
        'seo_tags',
        'seo_description',
        'blog_category_id',
        'blog_author_id',
    ];

    protected $dates = ['published_at', 'featured_until'];

    public array $validationRules = [
        'blog_category_id' => 'nullable|integer|exists:blog_categories,id,deleted_at,NULL',
        'blog_author_id' => 'nullable|integer|exists:blog_authors,id,deleted_at,NULL',
        'product_supplier_id' => 'nullable|integer|exists:product_suppliers,id,deleted_at,NULL',
    ];

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------
    public function blog_category(): BelongsTo
    {
        return self::category();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function images(): MorphMany
    {
        return $this->morphMany(GalleryImage::class, 'imageable');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(BlogAuthor::class, 'blog_author_id');
    }

    public function route(): MorphOne
    {
        return $this->morphOne(Route::class, 'routable');
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'embed_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'embed_id');
    }

    public function supplier(): HasOne
    {
        return $this->hasOne(Supplier::class);
    }

    public function navLinks(): HasMany
    {
        return $this->hasMany(NavigationLink::class, 'linkable_id');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeSearch($query, $terms)
    {
        return $query->where(function ($query) use ($terms) {
            foreach ($terms as $term) {
                $query->orWhere('title', 'like', "%$term%")
                    ->orWhere('slug', 'like', "%$term%");
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', Carbon::now())
            ->whereHas('images')
            ->whereNotNull('title')
            ->whereNotNull('primary_text');
    }

    public function scopeHasImage($query)
    {
        return $query->whereHas('images');
    }

    public function scopeHasEmbed($query)
    {
        return $query->whereHas('product')->orWhereHas('post');
    }

    public function scopeLike($query, $field, $value): void
    {
        $query->where($field, 'like', "%$value%");
    }

    public function scopeExcept($query, $exceptId)
    {
        return $query->where('id', '!=', $exceptId);
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function generateUrl(): string
    {
        $baseUrl = self::BASE_URL;
        $category = $this->category;

        if ($category) {
            $baseUrl .= "/$category->slug";
        }

        $baseUrl .= "/$this->slug";

        return $baseUrl;
    }

    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function setFeaturedAttribute($date): void
    {
        if (!empty($date)) {
           $this->attributes['featured'] = !$this->preventAttrSet ? Carbon::createFromFormat('d/m/Y', $date) : $date;
        }
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setPrimaryTextAttribute($value): string|null
    {
        return $this->attributes['primary_text'] = sanitizeHtmlText($value);
    }

    public function setSecondaryTextAttribute($value): string|null
    {
        return $this->attributes['secondary_text'] = sanitizeHtmlText($value);
    }

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
    public function getUrlAttribute(): string
    {
        return "postagem/$this->slug/$this->id";
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getFillable(): array
    {
        return $this->fillable;
    }

    public function getCover(): ?GalleryImage
    {
        return $this->images->firstWhere('main', 1) ?? $this->images->first();
    }

    public function getPrimaryTextAttribute(): string|null
    {
        $text = str_replace('oembed', 'iframe', $this->attributes['primary_text']);
        $text = str_replace('iframe url', 'iframe src', $text);
        $text = str_replace('<iframe', '<div class="iframe-container"><iframe', $text);

        return str_replace('</iframe>', '</iframe></div>', $text);
    }

    public function getSecondaryTextAttribute(): string|null
    {
        $text = str_replace('oembed', 'iframe', $this->attributes['secondary_text']);
        $text = str_replace('iframe url', 'iframe src', $text);
        $text = str_replace('<iframe', '<div class="iframe-container"><iframe', $text);

        return str_replace('</iframe>', '</iframe></div>', $text);
    }
}
