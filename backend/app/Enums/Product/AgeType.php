<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static From0To6Months()
 * @method static static From7To12Months()
 * @method static static From1To2Years()
 * @method static static From3To4Years()
 * @method static static From5To6Years()
 * @method static static From7To8Years()
 * @method static static Over8Years()
 */
final class AgeType extends Enum
{
    const From0To6Months = "0 a 6 meses";
    const From7To12Months = "7 a 12 meses";
    const From1To2Years = "1 a 2 anos";
    const From3To4Years = "3 a 4 anos";
    const From5To6Years = "5 a 6 anos";
    const From7To8Years = "7 a 8 anos";
    const Over8Years = "Acima de 8 anos";
}
