<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBannerImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('banner_images', function (Blueprint $table) {
            $table->dropColumn('dimensions');
            $table->dropColumn('target');
            $table->dropColumn('published_at');
            $table->dropColumn('published_end');
            $table->string('platform')->nullable()->after('link');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('banner_images', function (Blueprint $table) {
            $table->string('dimensions', 255);
            $table->enum('target', ['_self', '_blank'])->default('_self');
            $table->dateTime('published_at')->nullable();
            $table->dateTime('published_end')->nullable();
        });
    }
}
