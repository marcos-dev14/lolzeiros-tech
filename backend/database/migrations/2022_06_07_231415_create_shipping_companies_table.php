<?php

use App\Models\CountryState;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShippingCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->nullable();
            $table->string('name');
            $table->string('document')->nullable();
            $table->foreignIdFor(CountryState::class)->nullable()->constrained()->nullOnDelete();
            $table->string('phone')->nullable();
            $table->string('cellphone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
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
        Schema::dropIfExists('shipping_companies');
    }
}
