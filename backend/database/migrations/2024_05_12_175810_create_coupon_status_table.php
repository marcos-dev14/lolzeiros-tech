<?php

use App\Models\Buyer;
use App\Models\Coupon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupon_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Coupon::class)->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Buyer::class)->nullable()->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
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
        Schema::dropIfExists('coupon_statuses');
    }
}
