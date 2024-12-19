<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\Navigation;
use App\Models\NavigationLink;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Cache;

class NavigationService extends BaseService
{
    const LOCATION_FOOTER = 'footer';

    const LOCATION_HEADER = 'header';

    const LOCATIONS = [
        self::LOCATION_HEADER => 'Cabeçalho',
        self::LOCATION_FOOTER => 'Rodapé',
    ];

    public function __construct()
    {
        $this->model = new Navigation();
    }

    public function make(array $data): Model
    {
        $newData = $data;
        $newData['order'] = $this->model->getNextOrder($data['location'] ?? self::LOCATION_FOOTER);

        return parent::make($newData);
    }

    public static function getAllByLocation($location = null)
    {
        $cacheKey = strtoupper("NAVIGATION_$location");

        //Cache::forget($cacheKey);
        return Cache::rememberForever($cacheKey, function () use ($location) {
            $builder = (new (self::class))->model
                ->whereHas('links')
                ->with(['links' => function ($query) {
                    $query->select('id', 'label', 'order', 'url', 'navigation_id', 'linkable_type', 'linkable_id');
                }, 'links.post'])
                ->select('id', 'title', 'location');

            if (!empty($location)) {
                $builder->where('location', $location);
            }

            return $builder->get();
        });
    }
}
