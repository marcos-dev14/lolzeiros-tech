<?php

use App\Models\Buyer;
use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTitleBearerFieldToInvoiceBilletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoice_billets', function (Blueprint $table) {
            $table->string('title_bearer')->default('Fornecedor')->nullable()->after('invoice_billet_status_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invoice_billets', function (Blueprint $table) {
            $table->dropColumn('title_bearer');
        });
    }
}
