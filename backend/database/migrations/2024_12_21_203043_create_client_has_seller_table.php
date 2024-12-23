<?php

use App\Models\Client;
use App\Models\ClientGroup;
use App\Models\Seller;
use App\Models\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Psl\Type\nullable;

class CreateClientHasSellerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_has_seller', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ClientGroup::class)->constrained('client_groups')->cascadeOnDelete();
            $table->foreignIdFor(Seller::class)->nullable()->constrained('sellers')->cascadeOnDelete(); 
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
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
        Schema::dropIfExists('client_has_seller');
    }
}
