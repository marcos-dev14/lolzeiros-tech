<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Navigation;

class CreateNavigationLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('navigation_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->integer('order')->default(0);
            $table->string('url')->nullable();
            $table->string('linkable_type')->nullable();
            $table->integer('linkable_id')->nullable();
            $table->foreignIdFor(Navigation::class)->constrained()->cascadeOnDelete();
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
        Schema::dropIfExists('navigation_links');
    }
}
