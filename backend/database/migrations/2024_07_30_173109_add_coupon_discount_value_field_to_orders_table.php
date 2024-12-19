<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCouponDiscountValueFieldToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->decimal('coupon_discount_value')->default(0)->after('total_discount');
            $table->decimal('coupon_discount_value_ipi')->default(0)->after('coupon_discount_value');
            $table->decimal('installment_discount_value')->default(0)->after('coupon_discount_value_ipi');
            $table->decimal('installment_discount_value_ipi')->default(0)->after('installment_discount_value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->dropColumn('coupon_discount_value');
            $table->dropColumn('coupon_discount_value_ipi');
            $table->dropColumn('installment_discount_value');
            $table->dropColumn('installment_discount_value_ipi');
        });
    }
}
