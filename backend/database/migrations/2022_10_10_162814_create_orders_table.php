<?php

use App\Models\Buyer;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\CountryCity;
use App\Models\CountryState;
use App\Models\OrderType;
use App\Models\SaleChannel;
use App\Models\Seller;
use App\Models\ShippingCompany;
use App\Models\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('old_id')->nullable();
            $table->string('code', 11)->nullable();
            $table->string('origin', 10)->nullable();
            $table->string('installment_rule')->nullable();
            $table->decimal('installment_rule_value')->default(0.0);
            $table->boolean('fractional_box')->default(0);
            $table->decimal('profile_discount')->default(0.0);
            $table->date('payment_promotion_term_start')->nullable();
            $table->integer('count_products')->default(0);
            $table->integer('count_sum_products')->default(0);
            $table->string('current_status')->nullable();
            $table->string('lead_time')->nullable();
            $table->foreignIdFor(ShippingCompany::class)->nullable()->constrained()->nullOnDelete();
            $table->string('shipping_company_name')->nullable();
            $table->decimal('total_value')->default(0.0);
            $table->decimal('total_value_with_ipi')->default(0.0);
            $table->decimal('total_discount')->default(0.0);
            $table->longText('comments')->nullable();
            $table->longText('internal_comments')->nullable();
            $table->foreignIdFor(Client::class)->nullable()->constrained()->nullOnDelete();
            $table->datetime('client_last_order')->nullable();
            $table->string('address_street')->nullable();
            $table->string('address_number')->nullable();
            $table->string('address_complement')->nullable();
            $table->string('address_district')->nullable();
            $table->string('address_city')->nullable();
            $table->foreignIdFor(CountryCity::class)->nullable()->constrained()->nullOnDelete();
            $table->string('address_zipcode')->nullable();
            $table->foreignIdFor(CountryState::class)->nullable()->constrained()->nullOnDelete();
            $table->string('address_state')->nullable();
            $table->foreignIdFor(Supplier::class, 'product_supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_supplier_name')->nullable();
            $table->foreignIdFor(Seller::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(SaleChannel::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(OrderType::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Buyer::class)->nullable()->constrained()->nullOnDelete();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->string('buyer_cellphone')->nullable();
            $table->decimal('icms')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
