<?php

namespace Database\Seeders;

use App\Models\TaxRegime;
use Illuminate\Database\Seeder;

class TaxRegimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Microempresa (ME)'],
            ['name' => 'Empresa de Pequeno Porte (EPP)'],
            ['name' => 'Demais'],
        ];

        foreach ($data as $item) {
            TaxRegime::firstOrCreate($item);
        }
    }
}
