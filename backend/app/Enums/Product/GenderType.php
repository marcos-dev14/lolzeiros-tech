<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static GIRL()
 * @method static static BOY()
 * @method static static MALE()
 * * @method static static FEMALE()
 * @method static static UNISEX()
 * @method static static FOOD()
 */
final class GenderType extends Enum
{
    const GIRL = 'Menina';
    const BOY = 'Menino';
    const MALE = 'Masculino';
    const FEMALE = 'Feminino';
    const UNISEX = 'Unissex';
    const FOOD = 'Alimentos';
}
