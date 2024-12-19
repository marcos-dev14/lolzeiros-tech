<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameInvoicesLogTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('invoices_log', 'invoice_logs');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('invoice_logs', 'invoices_log');
    }
}
