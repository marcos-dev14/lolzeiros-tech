<?php

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number', 255)->nullable();
            $table->timestamp('issuance_date')->nullable();
            $table->dateTime('date_promotion')->nullable();
            $table->decimal('value', 8, 2);
            $table->string('term_payment')->nullable();
            $table->integer('term_qty')->nullable();
            $table->integer('term_day')->nullable();
            $table->decimal('commission', 8, 2)->default(0.0);
            $table->decimal('percentage_commission', 10, 2)->nullable();
            $table->decimal('commercial_commission', 8, 2)->default(0.0);
            $table->decimal('commercial_percentage', 10, 2)->nullable();
            $table->longText('observation')->nullable();
            $table->foreignIdFor(OrderStatus::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Order::class)->constrained()->cascadeOnDelete();
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
        Schema::dropIfExists('invoices');
    }
}
