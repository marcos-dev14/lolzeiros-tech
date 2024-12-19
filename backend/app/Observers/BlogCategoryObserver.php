<?php

namespace App\Observers;

use App\Models\BlogCategory;

class BlogCategoryObserver
{
    /**
     * Handle the BlogCategory "deleting" event.
     *
     * @param BlogCategory $blogCategory
     * @return void
     */
    public function deleting(BlogCategory $blogCategory)
    {
        $parent = $blogCategory->parent;

        $this->updateDescendants($blogCategory, $parent);
        $this->updatePosts($blogCategory, $parent);
    }

    protected function updateDescendants(BlogCategory $blogCategory, BlogCategory|null $parent): bool
    {
        $descendants = $blogCategory->descendants;

        if (!$descendants) {
            return false;
        }

        $builder = BlogCategory::whereIn('id', $descendants->pluck('id'));

        return $parent ? $builder->update(['parent_id' => $parent->id]) : $builder->delete();
    }

    protected function updatePosts(BlogCategory $blogCategory, BlogCategory|null $parent): bool
    {
        $posts = $blogCategory->posts;

        if (!$posts) {
            return false;
        }

        $builder = $blogCategory->posts()->whereIn('id', $posts->pluck('id'));

        return $parent ? $builder->update(['blog_category_id' => $parent->id]) : $builder->delete();
    }
}
