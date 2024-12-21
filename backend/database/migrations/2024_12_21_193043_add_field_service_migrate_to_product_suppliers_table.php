<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldServiceMigrateToProductSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_suppliers', function (Blueprint $table) {
            $table->string('service_migrate')->default('Ativo')->after('discount_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_suppliers', function (Blueprint $table) {
            $table->dropColumn([
                'service_migrate',
            ]);
        });
    }
}
