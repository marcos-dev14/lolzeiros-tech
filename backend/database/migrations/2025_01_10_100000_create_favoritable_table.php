<?php

use App\Models\Seller;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('favoritable', function (Blueprint $table) {
            $table->id();
            $table->string('favoritable_type');
            $table->integer('favoritable_id');
            $table->foreignIdFor(Seller::class)->nullable()->constrained('sellers')->cascadeOnDelete(); 
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
        Schema::dropIfExists('favoritable');
    }
}
