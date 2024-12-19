<?php

namespace Database\Seeders;

use App\Models\ShippingType;
use Illuminate\Database\Seeder;

class ShippingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'FOB'],
            ['name' => 'CIF']
        ];

        foreach ($data as $item) {
            ShippingType::firstOrCreate($item);
        }
    }
}
