<?php


return [
    'paths' => ['*'], // Autorise toutes les routes
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // En développement seulement
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];

