<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
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
            'Comprador',
            'Comprador e Proprietário',
            'Proprietário',
            'Administrativo',
            'Atendimento',
            'Comercial',
            'Diretoria',
            'Financeiro',
            'Jurídico',
            'Logistica',
            'Marketing',
            'Operação',
            'Presidência',
            'Produção',
            'Recursos Humanos',
            'T I',
            'API Receita',
        ];

        foreach($data as $item) {
            Role::firstOrCreate([
                'name' => $item,
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
