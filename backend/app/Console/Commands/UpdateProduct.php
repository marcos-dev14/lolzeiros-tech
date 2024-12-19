<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use App\Enums\Product\AvailabilityType;

class UpdateProduct extends Command
{
    protected $signature = 'update:product';
    protected $description = 'Update products solution for bug';

    public function handle()
    {
        $this->info('Fetching products...');
        $Products = Product::where('supplier_id', 58)->get();

        $this->info('Updating...');
        foreach ($Products as $Product) {
            $Product->availability = AvailabilityType::OUT_OF_LINE;
            $Product->update();
        }

        $this->info('Completed');
    }
}
