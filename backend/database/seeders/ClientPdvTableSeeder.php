<?php

namespace Database\Seeders;

use App\Models\ClientPdv;
use Illuminate\Database\Seeder;

class ClientPdvTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => '1 A 99 REAIS'],
            ['name' => 'ARMARINHO'],
            ['name' => 'ATACADO'],
            ['name' => 'BABY STORE'],
            ['name' => 'CONVENIÊNCIA E ALIMENTÍCIOS'],
            ['name' => 'DISTRIBUIDOR'],
            ['name' => 'DOCES E FESTAS'],
            ['name' => 'DROGARIA'],
            ['name' => 'E-COMMERCE'],
            ['name' => 'ELETROMÓVEIS E BRINQUEDOS'],
            ['name' => 'EMBALAGENS'],
            ['name' => 'ESPECIALISTA BRINQUEDOS'],
            ['name' => 'ESPORTES'],
            ['name' => 'LICITAÇÃO'],
            ['name' => 'LIVRARIA PAPELARIA E BRINQUEDOS'],
            ['name' => 'MARTINS MARKETPLACE'],
            ['name' => 'MODA CALÇADOS E BRINQUEDOS'],
            ['name' => 'PADARIA'],
            ['name' => 'REDE'],
            ['name' => 'SUPERMERCADO'],
            ['name' => 'UTILIDADES DOMÉSTICAS & PRESENTES'],
            ['name' => 'VAREJO'],
            ['name' => 'VENDA CORPORATIVA'],
        ];

        foreach ($data as $item) {
            $item['name'] = ucfirst(mb_strtolower($item['name']));
            ClientPdv::firstOrCreate($item);
        }
    }
}
