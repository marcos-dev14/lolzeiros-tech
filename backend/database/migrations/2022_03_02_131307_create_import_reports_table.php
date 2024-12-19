<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Import;

class CreateImportReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('import_reports', function (Blueprint $table) {
            $table->id();
            $table->string('line');
            $table->string('column_reference')->nullable();
            $table->string('column_name')->nullable();
            $table->string('product_reference')->nullable();
            $table->string('status');
            $table->string('message')->nullable();
            $table->foreignIdFor(Import::class)->constrained()->cascadeOnDelete();
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
        Schema::dropIfExists('import_reports');
    }
}
