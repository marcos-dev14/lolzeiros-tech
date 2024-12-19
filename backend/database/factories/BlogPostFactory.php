<?php

namespace Database\Factories;

use App\Models\BlogAuthor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\ArrayShape;

class BlogPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    #[ArrayShape([
        'title' => "string",
        'slug' => "string",
        'searcheable' => "string",
        'primary_text' => "string",
        'secondary_text' => "string",
        'published_at' => "\Carbon\Carbon",
        'seo_title' => "string",
        'seo_description' => "string",
        'seo_tags' => "string",
        'blog_author_id' => "integer",
    ])]
    public function definition(): array
    {
        $title = Str::limit($this->faker->paragraph, 65, null);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'searcheable' => (implode(', ', $this->faker->words(rand(4, 8)))),
            'published_at' => Carbon::now(),
            'primary_text' => "<p>{$this->faker->realText(800)}</p>",
            'secondary_text' => "<p>{$this->faker->realText(800)}</p>",
            'seo_title' => $title,
            'seo_description' => $this->faker->realText(190),
            'seo_tags' => (implode(', ', $this->faker->words(rand(4, 8)))),
            'blog_author_id' => BlogAuthor::inRandomOrder()->first()->id
        ];
    }

//    public function configure(): BlogPostFactory
//    {
//        return $this->afterCreating(function (BlogPost $post) {
//            $post->update([
//                'cover_slug' => $this->faker->image(storage_path("app/public/blogs"), 950, 635, fullPath: false)
//            ]);
//        });
//    }
}
