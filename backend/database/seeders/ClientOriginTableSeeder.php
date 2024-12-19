<?php

namespace Database\Seeders;

use App\Models\ClientOrigin;
use Illuminate\Database\Seeder;

class ClientOriginTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'AUGE - ANTES DO SALESFORCE'],
            ['name' => 'AUGE - PROSPECCAO'],
            ['name' => 'AUGE - SITE'],
            ['name' => 'CARTEIRA - CICERO'],
            ['name' => 'CARTEIRA - GMOR REPRES'],
            ['name' => 'CARTEIRA - HENRIQUE'],
            ['name' => 'CARTEIRA - LIBENCIO'],
            ['name' => 'CARTEIRA - LUCAS LAMERA'],
            ['name' => 'CARTEIRA - LUCAS MARRA'],
            ['name' => 'CARTEIRA - LUCIANA'],
            ['name' => 'CARTEIRA - PAPEL & COR REPRES'],
            ['name' => 'CARTEIRA - PAULO JANNUZZI'],
            ['name' => 'CARTEIRA - PAULO ROBERTO'],
            ['name' => 'CARTEIRA - RJ REPRES'],
            ['name' => 'CARTEIRA - UP HAPPY REPRES'],
            ['name' => 'E-MAIL'],
            ['name' => 'FORNECEDOR - ANGELS'],
            ['name' => 'FORNECEDOR - BARAO'],
            ['name' => 'FORNECEDOR - BRINQUEMIX'],
            ['name' => 'FORNECEDOR - DISMAT'],
            ['name' => 'FORNECEDOR - DTC'],
            ['name' => 'FORNECEDOR - GALA'],
            ['name' => 'FORNECEDOR - INVICTA'],
            ['name' => 'FORNECEDOR - MAGIC TOYS'],
            ['name' => 'FORNECEDOR - MULTILASER'],
            ['name' => 'FORNECEDOR - ROMA'],
            ['name' => 'FORNECEDOR - RUVOLO'],
            ['name' => 'FORNECEDOR - ZEIN'],
            ['name' => 'FEIRAS E CONVENCOES'],
            ['name' => 'MARTINS MARKETPLACE'],
            ['name' => 'NOVO CNPJ DE UM GRUPO JA EXISTENTE'],
            ['name' => 'OUTROS'],
            ['name' => 'PROSPECCAO - VENDEDOR'],
            ['name' => 'REDES SOCIAIS'],
            ['name' => 'TELEFONE'],
            ['name' => 'WHATSAPP'],
        ];

        foreach ($data as $item) {
            $item['name'] = ucfirst(mb_strtolower($item['name']));
            ClientOrigin::firstOrCreate($item);
        }
    }
}
