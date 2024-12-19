<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInstallmentDiscountValueFieldToProductsTwoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_instance_products', function (Blueprint $table) {
            //
            $table->decimal('installment_discount_value')->default(0)->after('coupon_discount_unit_ipi');
            $table->decimal('installment_discount_value_ipi')->default(0)->after('installment_discount_value');
            $table->decimal('installment_discount_unit')->default(0)->after('installment_discount_value_ipi');
            $table->decimal('installment_discount_unit_ipi')->default(0)->after('installment_discount_unit');
        });

        Schema::table('order_products', function (Blueprint $table) {
            //
            $table->decimal('installment_discount_value')->default(0)->after('coupon_discount_unit_ipi');
            $table->decimal('installment_discount_value_ipi')->default(0)->after('installment_discount_value');
            $table->decimal('installment_discount_unit')->default(0)->after('installment_discount_value_ipi');
            $table->decimal('installment_discount_unit_ipi')->default(0)->after('installment_discount_unit');
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
            $table->dropColumn('installment_discount_value');
            $table->dropColumn('installment_discount_value_ipi');
            $table->dropColumn('installment_discount_unit');
            $table->dropColumn('installment_discount_unit_ipi');
        });

        Schema::table('cart_instance_products', function (Blueprint $table) {
            //
            $table->dropColumn('installment_discount_value');
            $table->dropColumn('installment_discount_value_ipi');
            $table->dropColumn('installment_discount_unit');
            $table->dropColumn('installment_discount_unit_ipi');
        });
    }
}
