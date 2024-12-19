<?php

use App\Models\AttributeCategory;
use App\Models\Badge;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('api_reference')->nullable();
            $table->string('searcheable', 1000)->nullable();
            $table->string('image')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->dateTime('featured_until')->nullable();
            $table->boolean('use_video')->default(0);
            $table->string('youtube_link')->nullable();
            $table->longText('primary_text')->nullable();
            $table->longText('secondary_text')->nullable();
            $table->string('embed_type')->nullable();
            $table->integer('embed_id')->nullable();
            $table->string('inner_code')->nullable()->unique()->index();
            $table->string('reference');
            $table->string('ean13')->nullable();
            $table->string('display_code', 15)->nullable();
            $table->string('dun14')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('origin')->nullable();
            $table->string('release_year')->nullable();
            $table->string('catalog_name')->nullable();
            $table->integer('catalog_page')->nullable();
            $table->string('gender')->nullable();
            $table->decimal('size_height', 10)->nullable();
            $table->decimal('size_width', 10)->nullable();
            $table->decimal('size_length', 10)->nullable();
            $table->decimal('size_cubic', 10)->nullable();
            $table->decimal('size_weight', 10)->nullable();
            $table->string('packing_type')->nullable();
            $table->decimal('box_height', 10)->nullable();
            $table->decimal('box_width', 10)->nullable();
            $table->decimal('box_length', 10)->nullable();
            $table->decimal('box_cubic', 10)->nullable();
            $table->decimal('box_weight', 10)->nullable();
            $table->string('box_packing_type')->nullable();
            $table->decimal('unit_price', 10)->nullable();
            $table->decimal('unit_price_promotional', 10)->nullable();
            $table->integer('unit_minimal')->nullable();
            $table->decimal('unit_subtotal', 10)->nullable();
            $table->string('availability')->nullable();
            $table->date('expected_arrival')->nullable();
            $table->decimal('box_price', 10)->nullable();
            $table->decimal('box_price_promotional', 10)->nullable();
            $table->integer('box_minimal')->nullable();
            $table->decimal('box_subtotal', 10)->nullable();
            $table->decimal('ipi')->nullable();
            $table->string('ncm')->nullable();
            $table->decimal('cst')->nullable();
            $table->decimal('icms')->nullable();
            $table->string('certification')->nullable();
            $table->string('age_group')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_tags')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('qrcode_color')->nullable();
            $table->boolean('qrcode_custom_title')->nullable();
            $table->string('qrcode_title')->nullable();
            $table->string('qrcode_image1')->nullable();
            $table->string('qrcode_image2')->nullable();
            $table->integer('views')->nullable();
            $table->integer('sales')->nullable();
            $table->foreignIdFor(Supplier::class)->constrained('product_suppliers')->cascadeOnDelete();
            $table->foreignIdFor(Category::class)->nullable()->constrained('product_categories')->nullOnDelete();
            $table->foreignIdFor(Brand::class)->nullable()->constrained('product_brands')->nullOnDelete();
            $table->foreignIdFor(Badge::class)->nullable()->constrained('product_badges')->nullOnDelete();
            $table->foreignIdFor(AttributeCategory::class)->nullable()->constrained('product_attribute_categories')->nullOnDelete();
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
        Schema::dropIfExists('products');
    }
}
