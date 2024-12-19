<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToProductSearchHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_search_history', function (Blueprint $table) {
            $table->string('company_name')->nullable();
            $table->string('name')->nullable();
            $table->string('document')->nullable();
            $table->string('document_status')->nullable();
            $table->double('joint_stock')->nullable();
            $table->unsignedBigInteger('client_group_id')->nullable();
            $table->unsignedBigInteger('client_profile_id')->nullable();
            $table->unsignedBigInteger('tax_regime_id')->nullable();
            $table->unsignedBigInteger('client_pdv_id')->nullable();
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->unsignedBigInteger('lead_time_id')->nullable();
            $table->unsignedBigInteger('client_origin_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_search_history', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'name',
                'document',
                'document_status',
                'joint_stock',
                'client_group_id',
                'client_profile_id',
                'tax_regime_id',
                'client_pdv_id',
                'seller_id',
                'lead_time_id',
                'client_origin_id',
            ]);
        });
    }
}
