<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBannerBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('banner_blocks', function (Blueprint $table) {
            $table->dropColumn('width');
            $table->dropColumn('height');
            $table->dropColumn('hash');
            $table->string('name')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('banner_blocks', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->after('id', function (Blueprint $table) {
                $table->string('width', 5);
                $table->string('height', 5);
                $table->string('hash', 5)->nullable();
            });
        });
    }
}
