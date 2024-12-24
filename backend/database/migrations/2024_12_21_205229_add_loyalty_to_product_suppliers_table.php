<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLoyaltyToProductSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_suppliers', function (Blueprint $table) {
            $table->integer('loyalty')->nullable()->after('commercial_status');
        });
    }

    public function down()
    {
        Schema::table('product_suppliers', function (Blueprint $table) {
            $table->dropColumn('loyalty');
        });
    }
    
}
