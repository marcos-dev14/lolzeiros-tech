<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Supplier;
use App\Models\ClientProfile;
use App\Models\CountryState;
use App\Models\SupplierDiscount;
use App\Models\Category;

class CreateSupplierDiscountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_discounts', function (Blueprint $table) {
            $table->id();
            $table->string('type')->nullable();
            $table->decimal('discount_value', 10)->nullable();
            $table->decimal('additional_value', 10)->nullable();
            $table->boolean('fractional_box')->nullable();
            $table->decimal('auge_commission', 10)->nullable();
            $table->decimal('commercial_commission', 10)->nullable();
            $table->date('valid_until')->nullable();
            $table->foreignIdFor(Supplier::class)->nullable()->constrained('product_suppliers')->cascadeOnDelete();
            $table->foreignIdFor(ClientProfile::class)->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('supplier_states_discounts', function (Blueprint $table) {
            $table->foreignIdFor(CountryState::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(SupplierDiscount::class)->constrained()->cascadeOnDelete();
            $table->primary(['country_state_id', 'supplier_discount_id'], 'state_discount_state_id_discount_id_primary');
        });

        Schema::create('supplier_categories_discounts', function (Blueprint $table) {
            $table->foreignIdFor(Category::class)->constrained('product_categories')->cascadeOnDelete();
            $table->foreignIdFor(SupplierDiscount::class)->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'supplier_discount_id'], 'category_discount_category_id_discount_id_primary');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_categories_discounts');
        Schema::dropIfExists('supplier_states_discounts');
        Schema::dropIfExists('supplier_discounts');
    }
}
