<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\ArrayShape;

class BlogCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    #[ArrayShape([
        'name' => "string",
        'slug' => "string",
        'seo_title' => "array|string",
        'seo_description' => "string",
        'seo_keywords' => "string",
        'parent_id' => "null"
    ])]
    public function definition(): array
    {
        $name = Str::ucfirst($this->faker->words(rand(1, 3), true));

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'seo_title' => $name,
            'seo_description' => $this->faker->paragraph(),
            'seo_keywords' => (implode(', ', $this->faker->words(rand(4, 8)))),
            'parent_id' => null,
        ];
    }
}
