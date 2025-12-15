<?php
// backend/test_db.php
require_once 'config/config.php';
require_once 'config/Database.php';

echo "<h1>Prueba de Conexión a Base de Datos</h1>";
echo "<p>Intentando conectar con:</p>";
echo "<ul>";
echo "<li><strong>Host:</strong> " . DB_HOST . "</li>";
echo "<li><strong>Usuario:</strong> " . DB_USER . "</li>";
echo "<li><strong>Base de Datos:</strong> " . DB_NAME . "</li>";
echo "</ul>";

try {
    $database = new Database();
    $db = $database->connect();
    echo "<h2 style='color: green;'>¡Conexión Exitosa!</h2>";
    echo "<p>La base de datos está accesible desde este servidor.</p>";
} catch (Exception $e) {
    echo "<h2 style='color: red;'>Error de Conexión</h2>";
    echo "<p><strong>Detalle del error:</strong> " . $e->getMessage() . "</p>";
    
    echo "<h3>Posibles causas:</h3>";
    echo "<ul>";
    if (strpos($e->getMessage(), 'Connection refused') !== false) {
        echo "<li>MySQL no se está ejecutando en este servidor.</li>";
        echo "<li>El puerto 3306 está bloqueado.</li>";
    }
    if (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "<li>La contraseña es incorrecta (aunque sea la misma, verifica espacios en blanco).</li>";
        echo "<li>El usuario 'root' no tiene permisos para conectar desde 'localhost' o la IP remota.</li>";
    }
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "<li>La base de datos '<strong>" . DB_NAME . "</strong>' no ha sido creada aún en este servidor.</li>";
    }
    echo "</ul>";
}
?>
