<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Supplier;
use App\Models\Client;
use App\Models\ClientGroup;

class CreateSupplierInstallmentRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_installment_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('min_value');
            $table->string('installments')->nullable();
            $table->decimal('discount_value', 10)->nullable();
            $table->decimal('additional_value', 10)->nullable();
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
            $table->foreignIdFor(Client::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ClientGroup::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_installment_rules');
    }
}
