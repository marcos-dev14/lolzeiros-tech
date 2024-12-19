<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUseDateFieldsToProductBadgesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_badges', function (Blueprint $table) {
            // Alterando as colunas para o tipo 'date'
            $table->date('start_date')->nullable()->after('name');
            $table->date('end_date')->nullable()->after('start_date');
            $table->integer('use_date')->default(0)->after('end_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_badges', function (Blueprint $table) {
            // Removendo as colunas
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
            $table->dropColumn('use_date');
        });
    }
}
