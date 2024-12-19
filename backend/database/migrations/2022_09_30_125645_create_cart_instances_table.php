<?php

use App\Models\Cart;
use App\Models\Supplier;
use App\Models\SupplierInstallmentRule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cart_instances', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignIdFor(SupplierInstallmentRule::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Cart::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supplier::class, 'product_supplier_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['cart_id', 'product_supplier_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cart_instances');
    }
}
