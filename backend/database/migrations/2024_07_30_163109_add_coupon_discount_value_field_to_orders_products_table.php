<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCouponDiscountValueFieldToOrdersProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_products', function (Blueprint $table) {
            //
            $table->decimal('coupon_discount_value')->default(0)->after('discount');
            $table->decimal('coupon_discount_value_ipi')->default(0)->after('coupon_discount_value');
            $table->decimal('coupon_discount_unit')->default(0)->after('coupon_discount_value_ipi');
            $table->decimal('coupon_discount_unit_ipi')->default(0)->after('coupon_discount_unit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_products', function (Blueprint $table) {
            //
            $table->dropColumn('coupon_discount_value');
            $table->dropColumn('coupon_discount_value_ipi');
            $table->dropColumn('coupon_discount_unit');
            $table->dropColumn('coupon_discount_unit_ipi');
        });
    }
}
