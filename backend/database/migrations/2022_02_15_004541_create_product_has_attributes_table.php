<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Attribute;
use App\Models\Product;

class CreateProductHasAttributesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_has_attributes', function (Blueprint $table) {
            $table->foreignIdFor(Attribute::class)->constrained('product_attributes')->cascadeOnDelete();
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->string('value', 1000)->nullable();
            $table->primary(['attribute_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_has_attributes');
    }
}
