<?php

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static BLISTER()
 * @method static static OPEN_BOX()
 * @method static static ADHESIVE_BOX()
 * @method static static HIVE_BOX()
 * @method static static BOX_WITH_DISPLAY()
 * @method static static LITHOGRAPHED_BOX()
 * @method static static BROWN_BOX()
 * @method static static PLASTIC_ORGANIZER_BOX()
 * @method static static DISPLAY()
 * @method static static GLOVE()
 * @method static static NETWORK()
 * @method static static BAG()
 * @method static static NO_PACKAGING()
 * @method static static SHIRINKADO()
 * @method static static UNDERLAY()
 */
final class PackingType extends Enum
{
    const BLISTER = 'Blister';
    const OPEN_BOX = 'Caixa Aberta';
    const ADHESIVE_BOX = 'Caixa Adesivada';
    const HIVE_BOX = 'Caixa Colmeia';
    const BOX_WITH_DISPLAY = 'Caixa com Visor';
    const LITHOGRAPHED_BOX = 'Caixa Litografada';
    const BROWN_BOX = 'Caixa Parda';
    const PLASTIC_ORGANIZER_BOX = 'Caixa Plástica Organizadora';
    const DISPLAY = 'Display';
    const GLOVE = 'Luva ';
    const NETWORK = 'Rede';
    const BAG = 'Saco';
    const NO_PACKAGING = 'Sem Embalagem';
    const SHIRINKADO = 'Shirinkado';
    const UNDERLAY = 'Solapa';
}
