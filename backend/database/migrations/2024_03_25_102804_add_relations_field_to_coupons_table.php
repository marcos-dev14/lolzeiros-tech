<?php

use App\Models\Buyer;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationsFieldToCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->foreignIdFor(Buyer::class)->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Product::class)->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->unsignedBigInteger('shipping_company_id')->nullable();
            $table->unsignedBigInteger('supplier_id')->nullable();
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
            $table->dropForeign(['buyer_id']);
            $table->dropForeign(['product_id']);
            $table->dropColumn('category_id');
            $table->dropColumn('seller_id');
            $table->dropColumn('shipping_company_id');
            $table->dropColumn('supplier_id');
            $table->dropColumn('buyer_id');
            $table->dropColumn('product_id');
        });
    }
}
