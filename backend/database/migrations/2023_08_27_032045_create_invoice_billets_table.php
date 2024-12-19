<?php

use App\Models\Invoice;
use App\Models\InvoiceBilletStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceBilletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoice_billets', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->dateTime('due_date')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->double('value', 8, 2);
            $table->double('discount', 8, 2)->nullable();
            $table->double('discounted_price', 8, 2)->nullable();
            $table->decimal('commission', 8, 2)->default(0.0);
            $table->decimal('percentage_commission', 10, 2)->nullable();
            $table->decimal('commercial_commission', 8, 2)->default(0.0);
            $table->decimal('commercial_percentage', 10, 2)->nullable();
            $table->dateTime('paid_commission')->nullable();
            $table->dateTime('paid_commercial')->nullable();
            $table->longText('observation')->nullable();
            $table->foreignIdFor(Invoice::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(InvoiceBilletStatus::class)->constrained()->cascadeOnDelete();
            //$table->unsignedBigInteger('invoice_billet_status_id');
            //$table->foreign('invoice_billet_status_id', 'billets_statuses_foreign')->references('id')->on('invoice_billet_statuses')->cascadeOnDelete();
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
        Schema::dropIfExists('invoice_billets');
    }
}
