<?php

namespace Database\Seeders;

use App\Models\ClientProfile;
use Illuminate\Database\Seeder;

class ClientProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'BRONZE'],
            ['name' => 'PRATA'],
            ['name' => 'OURO'],
            ['name' => 'DIAMANTE'],
        ];

        foreach ($data as $item) {
            ClientProfile::firstOrCreate($item);
        }
    }
}
