<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('contactable_type');
            $table->integer('contactable_id');
            $table->string('name');
            $table->string('cellphone')->nullable();
            $table->string('phone')->nullable();
            $table->string('phone_branch')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->foreignIdFor(Role::class)->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('contacts');
    }
}
