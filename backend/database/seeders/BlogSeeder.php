<?php

namespace Database\Seeders;

use App\Models\BlogAuthor;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Embed;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('blog_authors')->truncate();
        DB::table('blog_posts')->truncate();
        DB::table('blog_categories')->truncate();

        BlogAuthor::factory()->count(4)->create();

        BlogCategory::factory()
            ->has(BlogPost::factory()->count(3), 'posts')
            ->count(20)
            ->create();

        $posts = BlogPost::all();
        $posts->each(function ($post) {
            $embed = BlogPost::where('id', '!=', $post->id)->inRandomOrder()->first();
            $post->update([
                'embed_type' => $post::class,
                'embed_id' => $embed->id ?? null
            ]);
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
