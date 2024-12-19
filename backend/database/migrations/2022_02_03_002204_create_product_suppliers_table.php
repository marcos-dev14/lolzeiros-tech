<?php

use App\Models\BlogPost;
use App\Models\LeadTime;
use App\Models\ShippingType;
use App\Models\TaxRegime;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('name')->nullable();
            $table->string('slug');
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(1);
            $table->string('document')->nullable();
            $table->string('document_status')->nullable();
            $table->string('state_registration')->nullable();
            $table->string('code')->nullable();
            $table->date('activity_start')->nullable();
            $table->string('status')->nullable();
            $table->date('auge_register')->nullable();
            $table->string('corporate_email')->nullable();
            $table->string('website')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('youtube')->nullable();
            $table->string('twitter')->nullable();
            $table->boolean('suspend_sales')->default(0);
            $table->string('commercial_status')->nullable();
            $table->boolean('order_schedule')->nullable();
            $table->boolean('order_balance')->nullable();
            $table->boolean('enter_price_on_order')->nullable();
            $table->boolean('can_migrate_service')->nullable();
            $table->string('auto_observation_order')->nullable();
            $table->foreignIdFor(LeadTime::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ShippingType::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(TaxRegime::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(BlogPost::class)->nullable()->constrained()->nullOnDelete();
            $table->dateTime('last_imported_at')->nullable();
            $table->dateTime('last_but_one_imported_at')->nullable();
            $table->decimal('min_ticket', 10)->nullable();
            $table->decimal('min_order', 10)->nullable();
            $table->boolean('fractional_box')->default(0);
            $table->boolean('allows_reservation')->default(0);
            $table->decimal('client_mei_value', 10)->nullable();
            $table->decimal('client_vip_value', 10)->nullable();
            $table->decimal('client_premium_value', 10)->nullable();
            $table->decimal('client_platinum_value', 10)->nullable();
            $table->string('discount_type')->nullable();
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
        Schema::dropIfExists('product_suppliers');
    }
}
