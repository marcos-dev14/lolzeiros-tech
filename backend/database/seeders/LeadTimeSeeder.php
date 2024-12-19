<?php

namespace Database\Seeders;

use App\Models\LeadTime;
use Illuminate\Database\Seeder;

class LeadTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => '1 a 10 dias'],
            ['name' => '11 a 20 dias'],
            ['name' => '21 a 30 dias'],
        ];

        foreach ($data as $item) {
            LeadTime::firstOrCreate($item);
        }
    }
}
