<?php

use App\Models\Buyer;
use App\Models\ClientGroup;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBrandForeignToCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->foreign('brand_id')->references('id')->on('product_brands')
                ->onDelete('cascade');
            $table->foreign('supplier_id')->references('id')->on('product_suppliers')
                ->onDelete('cascade');
            $table->foreign('shipping_company_id')->references('id')->on('shipping_companies')
                ->onDelete('cascade');
            $table->foreign('seller_id')->references('id')->on('sellers')
                ->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('product_categories')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn('brand_id');
            $table->dropColumn('supplier_id');
            $table->dropColumn('shipping_company_id');
            $table->dropColumn('seller_id');
            $table->dropColumn('category_id');
        });
    }
}
