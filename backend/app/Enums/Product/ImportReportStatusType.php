<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static SUCCESS()
 * @method static static ERROR()
 */
final class ImportReportStatusType extends Enum
{
    const SUCCESS = 'SUCESSO';
    const ERROR = 'ERRO';
}
