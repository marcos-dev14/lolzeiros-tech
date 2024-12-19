<?php

namespace Database\Seeders;

use App\Models\CommissionRule;
use Illuminate\Database\Seeder;

class CommissionRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Parcelamento: Boleto'],
            ['name' => 'Parcelamento: Cartão de Crédito'],
            ['name' => 'À vista antecipado: Pix ou Depósito'],
            ['name' => 'À vista antecipado: Cartão de Crédito'],
        ];

        foreach($data as $item) {
            CommissionRule::firstOrCreate($item);
        }
    }
}
