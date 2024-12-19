<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\BlockingRule;
use App\Models\Supplier;

class CreateSupplierBlockedRegions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_blocked_regions', function (Blueprint $table) {
            $table->foreignIdFor(BlockingRule::class, 'client_region_id')->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
            $table->primary(['client_region_id', 'supplier_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_blocked_regions');
    }
}
