<?php

namespace Database\Seeders;

use App\Models\AddressType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $data = [
            'Principal',
            'Entrega'
        ];

        foreach($data as $item) {
            AddressType::firstOrCreate([
                'name' => $item,
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
