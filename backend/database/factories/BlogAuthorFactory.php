<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogAuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $name = $this->faker->name;
        $slug = Str::slug($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'resume' => $this->faker->realText(100),
            'email' => $this->faker->email,
            'instagram' => "https://instagram.com/$slug",
            'facebook' => "https://facebook.com/$slug",
            'youtube' => "https://youtube.com/$slug",
            'twitter' => "https://twitter.com/$slug",
            'biography' => $this->faker->realTextBetween(350, 1200),
            'use_card_on_post' => $this->faker->boolean,
            'card_color' => $this->faker->hexColor,
            'image' => null,
        ];
    }
}
