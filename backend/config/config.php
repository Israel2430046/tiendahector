<?php
// configuracion de la base de datos
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'tienda_abarrotes');
define('DB_USER', 'root');
define('DB_PASS', 'e2gk8ann86');
define('DB_CHARSET', 'utf8mb4');

// configuracion de la aplicacion
define('JWT_SECRET', 'tu_clave_secreta_super_segura_2024');
define('JWT_EXPIRATION', 86400); // 24 horas en segundos

// zona horaria
date_default_timezone_set('America/Mexico_City');

// habilitar cors para desarrollo
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
