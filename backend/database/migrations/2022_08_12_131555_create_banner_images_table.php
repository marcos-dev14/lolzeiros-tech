<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBannerImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banner_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255);
            $table->string('label', 255)->nullable();
            $table->string('dimensions', 255);
            $table->integer('order');
            $table->string('link')->nullable();
            $table->string('imageping')->nullable();
            $table->enum('target', ['_self', '_blank'])->default('_self');
            $table->dateTime('published_at')->nullable();
            $table->dateTime('published_end')->nullable();
            $table->bigInteger('block_id')->unsigned()->nullable();
            $table->foreign('block_id')->references('id')->on('banner_blocks')->onDelete('cascade');
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
        Schema::dropIfExists('banner_images');
    }
}
