<?php

namespace App\Models\Admin\Banner;

use Dyrynda\Database\Support\CascadeSoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use SoftDeletes, CascadeSoftDeletes;

    protected $fillable = ['name'];

    protected $table = 'banner_blocks';

    const PLATFORM_DESKTOP = 'desktop';

    const PLATFORM_MOBILE = 'mobile';

    protected array $cascadeDeletes = ['images'];

    //------------------------------------------------------------------
    // Events
    //------------------------------------------------------------------
    protected static function boot()
    {
        parent::boot();

        self::creating(function (Model $model) {
            if (empty($model->hash)) {
                $model->attributes['hash'] = makeUniqueHashFromModel($model);
            }
        });
    }

    //------------------------------------------------------------------
    // Eloquent Relations
    //------------------------------------------------------------------
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function desktopImages(): HasMany
    {
        return $this->images()->where('platform', self::PLATFORM_DESKTOP);
    }

    public function mobileImages(): HasMany
    {
        return $this->images()->where('platform', self::PLATFORM_MOBILE);
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // Acessors
    //------------------------------------------------------------------
}
