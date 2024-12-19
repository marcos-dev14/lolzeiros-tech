<?php

use Illuminate\Database\Migrations\Migration;

class CreateAvailableProductsView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW available_products AS
                SELECT * FROM `products` WHERE (
                    (`products`.`title` is not null)
                    and (`products`.`title` <> '')
                    and (`products`.`category_id` is not null)
                    and (`products`.`brand_id` is not null)
                    and (`products`.`cst` is not null)
                    and (`products`.`ipi` is not null)
                    and (`products`.`ncm` is not null)
                    and (`products`.`ncm` <> '')
                    and (`products`.`box_price` is not null)
                    and (`products`.`box_price` > 0.0)
                    and (`products`.`box_minimal` is not null)
                    and (`products`.`box_minimal` > 0.0)
                    and (`products`.`published_at` <= now())
                    and (`products`.`availability` <> 'Fora de linha')
                    and (`products`.`availability` <> '')
                )"
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `available_products`;");
    }
}
