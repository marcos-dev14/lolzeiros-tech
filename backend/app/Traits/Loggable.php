<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait Loggable
{
    public function addLogMessage(string $logKey, string $message): void
    {
        $logMessages = Cache::get($logKey, []);

        if (!is_array($logMessages)) {
            $logMessages = [];
        }

        $logMessages[] = $message;

        Cache::put($logKey, $logMessages, now()->addMinutes(10));
    }
}
