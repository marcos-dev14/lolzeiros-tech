<?php

return [
    'hashAccess' => [
        'master' => [
            'hash' => 'Bearer $2y$10$XpgV9iIs63EuXQ8u6W/2seqmHU3GTRRLWWWNc08JvkzY2sJs2L3I.',
            'endpoints' => ['*']
        ],
        'powerbi' => [
            'hash' => 'Bearer $2y$10$SYhaJtfWx/4.20hkOP895O0BysnasXliTNeFu0gZqgYXl9tnC5SdK',
            'endpoints' => ['*']
        ],
        'hosana' => [
            'hash' => 'Bearer $2y$10$VNLf3zlxAe7/fLTloeKPVuL4JrZRqnL.XtiLmrES3d8q5iP/vGrXy',
            'endpoints' => [
                'api.login',
                'api.clients.index',
                'api.clients.show',
                'api.orders.index',
                'api.orders.show',
            ]
        ]
    ]
];
