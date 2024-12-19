<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Bank;

class CreateBankAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('bankable_type');
            $table->integer('bankable_id');
            $table->string('owner_name');
            $table->string('document');
            $table->string('account_number')->nullable();
            $table->string('agency')->nullable();
            $table->string('operation')->nullable();
            $table->string('pix_key')->nullable();
            $table->string('paypal')->nullable();
            $table->foreignIdFor(Bank::class)->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('bank_accounts');
    }
}
