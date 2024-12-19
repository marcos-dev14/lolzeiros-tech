<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static LITHOGRAPHED_BOX()
 * @method static static BROWN_BOX()
 * @method static static DISPLAY()
 * @method static static BAG()
 */
final class BoxPackingType extends Enum
{
    const LITHOGRAPHED_BOX = 'Caixa Litografada';
    const BROWN_BOX = 'Caixa Parda';
    const DISPLAY = 'Display';
    const BAG = 'Saco';
}
