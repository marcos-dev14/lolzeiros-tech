<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static NATIONAL()
 * @method static static IMPORTED()
 */
final class OriginType extends Enum
{
    const NATIONAL = 'Nacional';
    const IMPORTED = 'Importado';
}
