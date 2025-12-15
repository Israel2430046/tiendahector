<?php
require_once 'backend/config/config.php';
require_once 'backend/config/Database.php';

$database = new Database();
$conn = $database->connect();

$email = 'admin@tienda.com';
$password = 'admin123';
$hashFromUser = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

echo "--- Debugging Login ---\n";
echo "Testing hash provided by user:\n";
if (password_verify($password, $hashFromUser)) {
    echo "MATCH: 'admin123' matches the provided hash.\n";
} else {
    echo "MISMATCH: 'admin123' does NOT match the provided hash.\n";
}

echo "\nChecking database for email: $email\n";
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "User found:\n";
    print_r($user);
    
    echo "\nVerifying stored password against 'admin123':\n";
    if (password_verify($password, $user['password'])) {
        echo "MATCH: Database password matches 'admin123'.\n";
    } else {
        echo "MISMATCH: Database password does NOT match 'admin123'.\n";
    }
} else {
    echo "User not found in database.\n";
}
?>
