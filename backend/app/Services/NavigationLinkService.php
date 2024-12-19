<?php

namespace App\Services;

use App\Models\NavigationLink;
use Illuminate\Database\Eloquent\Model;

class NavigationLinkService extends BaseService
{
    public function __construct()
    {
        $this->model = new NavigationLink();
    }

    public function make(array $data): Model
    {
        $newData = $data;
        $newData['order'] = $this->model->getNextOrder($data['navigation_id']);

        return parent::make($newData);
    }
}
