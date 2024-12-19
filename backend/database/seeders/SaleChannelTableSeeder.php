<?php

namespace Database\Seeders;

use App\Models\SaleChannel;
use Illuminate\Database\Seeder;

class SaleChannelTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Showroom'],
            ['name' => 'Visita ao cliente'],
            ['name' => 'Whatsapp'],
            ['name' => 'Telefone'],
            ['name' => 'E-mail'],
            ['name' => 'Auto-Atendimento'],
        ];

        foreach($data as $item) {
            SaleChannel::firstOrCreate($item);
        }
    }
}
