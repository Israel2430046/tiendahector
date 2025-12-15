<?php
// script para generar hash correcto de password y asegurar que existe el admin

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
    
    // verificar si existe el usuario
    $check = $conn->query("SELECT idUsuario FROM usuarios WHERE email = 'admin@tienda.com'");
    
    if ($check->rowCount() > 0) {
        // actualizar usuario existente
        $query = "UPDATE usuarios SET password = :password WHERE email = 'admin@tienda.com'";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();
        echo "✓ password actualizado correctemente para admin@tienda.com\n";
    } else {
        // crear usuario si no existe
        echo " el usuario no existia, creandolo...\n";
        $query = "INSERT INTO usuarios (nombreUsuario, email, password, idRol) VALUES ('Administrador', 'admin@tienda.com', :password, 1)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();
        echo "✓ usuario admin creado exitosamente\n";
    }
    
    echo "\n----------------------------------------\n";
    echo "INTENTA INGRESAR AHORA CON:\n";
    echo "Email: admin@tienda.com\n";
    echo "Password: admin123\n";
    echo "----------------------------------------\n";
    
} catch(PDOException $e) {
    echo "error de conexion: " . $e->getMessage() . "\n";
}
?>
