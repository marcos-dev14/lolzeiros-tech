<?php

use App\Models\ClientProfile;
use App\Models\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupplierProfileFractionationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_profile_fractionations', function (Blueprint $table) {
            $table->bigInteger('id')->autoIncrement();
            $table->boolean('enable')->default(0);
            $table->foreignIdFor(ClientProfile::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supplier::class, 'product_supplier_id')->constrained()->cascadeOnDelete();
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
        Schema::dropIfExists('supplier_profile_fractionations');
    }
}
