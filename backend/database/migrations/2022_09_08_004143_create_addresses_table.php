<?php

use App\Models\CountryCity;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\CountryState;
use App\Models\AddressType;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('addressable_type');
            $table->integer('addressable_id');
            $table->string('zipcode');
            $table->string('street');
            $table->string('number');
            $table->string('complement')->nullable();
            $table->string('district');
            $table->foreignIdFor(CountryState::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(CountryCity::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(AddressType::class)->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('addresses');
    }
}
