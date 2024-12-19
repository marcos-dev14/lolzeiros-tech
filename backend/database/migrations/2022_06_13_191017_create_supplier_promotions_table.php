<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;
use App\Models\Supplier;

class CreateSupplierPromotionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_promotions', function (Blueprint $table) {
            $table->id();
            $table->decimal('discount_value', 10)->nullable();
            $table->integer('min_quantity')->nullable();
            $table->date('valid_until')->nullable();
            $table->string('type');
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('supplier_promotables', function (Blueprint $table) {
            $table->bigInteger('supplier_promotion_id');
            $table->bigInteger('promotable_id');
            $table->string('promotable_type');
            $table->primary(['promotable_id', 'supplier_promotion_id', 'promotable_type'], 'supplier_promotable_primary');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_promotables');
        Schema::dropIfExists('supplier_promotions');
    }
}
