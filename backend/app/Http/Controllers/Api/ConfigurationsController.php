<?php

namespace App\Http\Controllers\Api;

use App\Enums\Product\AgeType;
use App\Enums\Product\AvailabilityType;
use App\Enums\Product\BoxPackingType;
use App\Enums\Product\CertificationType;
use App\Enums\Product\GenderType;
use App\Enums\Product\OriginType;
use App\Enums\Product\PackingType;
use Illuminate\Http\JsonResponse;

class ConfigurationsController extends BaseController
{
    public function __invoke(): JsonResponse
    {
        $data = [
            'products' => [
                'age_group' => [
                    AgeType::From0To6Months(),
                    AgeType::From7To12Months(),
                    AgeType::From1To2Years(),
                    AgeType::From3To4Years(),
                    AgeType::From5To6Years(),
                    AgeType::From7To8Years(),
                    AgeType::Over8Years(),
                ],
                'availability' => [
                    AvailabilityType::AVAILABLE(),
                    AvailabilityType::UNAVAILABLE(),
                    AvailabilityType::PRE_SALE(),
                    AvailabilityType::OUT_OF_LINE(),
                    AvailabilityType::IN_REGISTRATION(),
                ],
                'box_packing' => [
                    BoxPackingType::LITHOGRAPHED_BOX(),
                    BoxPackingType::BROWN_BOX(),
                    BoxPackingType::DISPLAY(),
                    BoxPackingType::BAG(),
                ],
                'certification' => [
                    CertificationType::INMETRO(),
                    CertificationType::ANVISA(),
                    CertificationType::ANATEL(),
                ],
                'gender' => [
                    GenderType::GIRL(),
                    GenderType::BOY(),
                    GenderType::MALE(),
                    GenderType::FEMALE(),
                    GenderType::UNISEX(),
                    GenderType::FOOD(),
                ],
                'origin' => [
                    OriginType::NATIONAL(),
                    OriginType::IMPORTED(),
                ],
                'packing_type' => [
                    PackingType::BLISTER(),
                    PackingType::OPEN_BOX(),
                    PackingType::ADHESIVE_BOX(),
                    PackingType::HIVE_BOX(),
                    PackingType::BOX_WITH_DISPLAY(),
                    PackingType::LITHOGRAPHED_BOX(),
                    PackingType::BROWN_BOX(),
                    PackingType::PLASTIC_ORGANIZER_BOX(),
                    PackingType::DISPLAY(),
                    PackingType::GLOVE(),
                    PackingType::NETWORK(),
                    PackingType::BAG(),
                    PackingType::NO_PACKAGING(),
                    PackingType::SHIRINKADO(),
                    PackingType::UNDERLAY(),
                ],
                'release' => array_map('strval', range(2010, 2030))
            ]
        ];

        return $this->sendResponse($data, 'Configurações encontradas');
    }
}
