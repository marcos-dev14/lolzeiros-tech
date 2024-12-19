<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateTableProductSearchHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_search_history', function (Blueprint $table) {
            $table->id();
            $table->string('term_search');
            $table->timestamp('searched_at')->useCurrent();
            $table->unsignedBigInteger('buyer_id')->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->unsignedBigInteger('role_id')->nullable();
            $table->string('role_name')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE product_search_history ADD FULLTEXT(term_search)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_search_history');
    }
}
