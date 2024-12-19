<?php

use App\Models\BlockingRule;
use App\Models\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupplierHasBlockingRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_has_blocking_rules', function (Blueprint $table) {
            $table->foreignIdFor(BlockingRule::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
            $table->primary(['blocking_rule_id', 'supplier_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_has_blocking_rules');
    }
}
