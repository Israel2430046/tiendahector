<?php
// script para generar hash correcto de password y actualizar base de datos

// configuracion de base de datos
$host = 'localhost';
$dbname = 'tienda_abarrotes';
$user = 'root';
$pass = 'e2gk8ann86';

try {
    // conectar a base de datos
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // generar hash correcto para admin123
    $password = 'admin123';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    echo "generando hash para password: $password\n";
    echo "hash generado: $hashedPassword\n\n";
    
    // actualizar usuario administrador
    $query = "UPDATE usuarios SET password = :password WHERE email = 'admin@tienda.com'";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':password', $hashedPassword);
    
    if ($stmt->execute()) {
        echo "✓ password actualizado exitosamente!\n\n";
        echo "ahora puedes iniciar sesion con:\n";
        echo "email: admin@tienda.com\n";
        echo "password: admin123\n";
    } else {
        echo "✗ error al actualizar password\n";
    }
    
} catch(PDOException $e) {
    echo "error de conexion: " . $e->getMessage() . "\n";
    echo "\nverifica que:\n";
    echo "1. mariadb este corriendo\n";
    echo "2. la base de datos 'tienda_abarrotes' exista\n";
    echo "3. las credenciales sean correctas\n";
}
?>
