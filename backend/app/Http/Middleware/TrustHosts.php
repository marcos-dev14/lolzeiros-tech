<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustHosts as Middleware;

class TrustHosts extends Middleware
{
    /**
     * Get the host patterns that should be trusted.
     *
     * @return array
     */
    public function hosts(): array
    {
        return [
            'localhost:8080',
            'auge.test',
            $this->allSubdomainsOfApplicationUrl(),
        ];
    }
}