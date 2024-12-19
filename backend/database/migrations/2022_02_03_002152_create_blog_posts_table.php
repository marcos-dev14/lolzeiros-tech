<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\BlogAuthor;
use App\Models\BlogCategory;

class CreateBlogPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 255);
            $table->string('slug', 255);
            $table->string('searcheable')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->dateTIme('featured_until')->nullable();
            $table->boolean('use_video')->default(0);
            $table->string('youtube_link')->nullable();
            $table->longText('primary_text')->nullable();
            $table->longText('secondary_text')->nullable();
            $table->string('embed_type')->nullable();
            $table->unsignedBigInteger('embed_id')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_tags')->nullable();
            $table->string('seo_description')->nullable();
            $table->foreignIdFor(BlogAuthor::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(BlogCategory::class)->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('blog_posts');
    }
}
