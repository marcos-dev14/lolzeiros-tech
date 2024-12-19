<?php

use App\Models\Buyer;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClientIdFieldToCouponStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coupon_statuses', function (Blueprint $table) {
            $table->foreignIdFor(Client::class)->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coupon_statuses', function (Blueprint $table) {
            $table->dropColumn('client_id');
        });
    }
}
