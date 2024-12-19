<?php

use App\Models\LeadTime;
use App\Models\TaxRegime;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\BlockingRule;
use App\Models\ClientOrigin;
use App\Models\ClientPdv;
use App\Models\ClientProfile;
use App\Models\ClientGroup;
use App\Models\Seller;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->nullable();
            $table->string('name')->nullable();
            $table->string('document')->nullable();
            $table->string('document_status')->nullable();
            $table->string('state_registration')->nullable();
            $table->text('activity_list')->nullable();
            $table->text('legal_representative_list')->nullable();
            $table->string('joint_stock')->nullable();
            $table->string('code')->nullable();
            $table->date('activity_start')->nullable();
            $table->date('auge_register')->nullable();
            $table->boolean('has_ecommerce')->nullable();
            $table->string('corporate_email')->nullable();
            $table->string('website')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('youtube')->nullable();
            $table->string('twitter')->nullable();
            $table->string('newsletter_tags')->nullable();
            $table->string('commercial_status')->nullable();
            $table->boolean('order_schedule')->nullable();
            $table->boolean('order_balance')->nullable();
            $table->boolean('enter_price_on_order')->nullable();
            $table->boolean('can_migrate_service')->nullable();
            $table->boolean('blocked_suppliers')->nullable();
            $table->string('auto_observation_order')->nullable();
            $table->foreignIdFor(ClientGroup::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ClientProfile::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(TaxRegime::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ClientPdv::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Seller::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(LeadTime::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ClientOrigin::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(BlockingRule::class)->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('clients');
    }
}
