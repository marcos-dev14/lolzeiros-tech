<?php

use App\Models\CartInstance;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartInstanceProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cart_instance_products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('reference');
            $table->string('image')->nullable();
            $table->integer('qty');
            $table->decimal('ipi')->nullable()->default(0);
            $table->decimal('ipi_value')->nullable()->default(0);
            $table->decimal('unit_price')->default(0.0);
            $table->decimal('unit_price_with_ipi')->nullable()->default(0);
            $table->decimal('original_price')->default(0.0);
            $table->decimal('subtotal')->default(0.0);
            $table->decimal('subtotal_with_ipi')->nullable()->default(0);
            $table->decimal('discount')->default(0.0);
            $table->decimal('discount_percentage')->default(0.0);
            $table->boolean('fractionated')->default(0);
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(CartInstance::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['product_id', 'cart_instance']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cart_instance_products');
    }
}
