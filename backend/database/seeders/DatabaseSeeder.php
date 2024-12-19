<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

//        User::firstOrCreate([
//            'name' => 'Administrador',
//            'email' => 'r@g.c',
//            'password' => bcrypt('a')
//        ]);

        $this->call(ClientProfileSeeder::class);
        $this->call(CommissionRuleSeeder::class);
        $this->call(LeadTimeSeeder::class);
        $this->call(CountryStateSeeder::class);
        $this->call(CountryCitySeeder::class);
        $this->call(TaxRegimeSeeder::class);
        $this->call(BankSeeder::class);
        $this->call(AddressTypeSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(ShippingTypeSeeder::class);
    }
}
