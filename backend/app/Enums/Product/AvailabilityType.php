<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static AVAILABLE()
 * @method static static UNAVAILABLE()
 * @method static static PRE_SALE()
 * @method static static OUT_OF_LINE()
 * @method static static OUTLET()
 */
final class AvailabilityType extends Enum
{
    const AVAILABLE = 'Disponível';
    const UNAVAILABLE = 'Indisponível';
    const PRE_SALE = 'Pré-venda';
    const OUT_OF_LINE = 'Fora de linha';
    const OUTLET = 'Outlet';
    const IN_REGISTRATION = 'Em cadastro';
}
