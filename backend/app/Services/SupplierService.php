<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use Throwable;

class SupplierService extends BaseWithImageService
{
    public function __construct(protected ImageService $imageService) {
        parent::__construct($this->imageService);

        $this->model = new Supplier();
    }

    /**
     * @throws Throwable
     */
    public function show($id): ?Model
    {
        $this->relations = [
            'blogPost',
            'taxRegime',
            'phones',
            'commissionRules',
            'blockedRegions',
            'blockingRules',
            'blockedStates',
            'paymentPromotions',
            'installmentRules',
            'stateDiscounts',
            'profileDiscounts',
            'profileDiscounts.states',
            'profileDiscounts.profile',
            'profileDiscounts.categories',
            'promotions',
            'promotions.categories',
            'promotions.products',
            'contacts.role',
            'addresses.state',
            'addresses.type',
            'bankAccounts.bank',
            'fractionations.profile'
        ];

        $this->counts = ['categories', 'products', 'availableProducts'];

        return parent::getById($id);
    }

}
