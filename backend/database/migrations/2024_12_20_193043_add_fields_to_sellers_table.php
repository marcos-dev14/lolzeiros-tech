<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToSellersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->string('status')->default('Ativo')->after('name');
            $table->string('password')->default('$2a$12$Pf1adgIGIjv/cr7EPht3f.lLOGgqlbPh64uM7AEty5T5YAcp9TBE.')->after('name');
            $table->string('avaliable_opportunity')->default('True')->after('status');
            $table->string('origin')->nullable()->after('avaliable_opportunity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'password',
                'avaliable_opportunity',
                'origin',
            ]);
        });
    }
}
