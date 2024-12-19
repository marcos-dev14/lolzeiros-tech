<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static Inmetro()
 * @method static static Anvisa()
 * @method static static Anatel()
 */
final class CertificationType extends Enum
{
    const INMETRO = 'Inmetro';
    const ANVISA = 'Anvisa';
    const ANATEL = 'Anatel';
}
