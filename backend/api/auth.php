<?php
require_once '../config/config.php';
require_once '../config/Database.php';

class Auth {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }
    
    // generar token jwt simple
    private function generateToken($userId, $email, $rol) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'userId' => $userId,
            'email' => $email,
            'rol' => $rol,
            'exp' => time() + JWT_EXPIRATION
        ]);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    // login de usuario
    public function login($email, $password) {
        try {
            $query = "SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, 
                             r.nombreRol, r.idRol
                      FROM usuarios u
                      INNER JOIN roles r ON u.idRol = r.idRol
                      WHERE u.email = :email AND u.activo = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                // verificar password (para el usuario por defecto usamos password_verify)
                if (password_verify($password, $user['password'])) {
                    // actualizar ultimo acceso
                    $updateQuery = "UPDATE usuarios SET ultimoAcceso = NOW() WHERE idUsuario = :id";
                    $updateStmt = $this->conn->prepare($updateQuery);
                    $updateStmt->bindParam(':id', $user['idUsuario']);
                    $updateStmt->execute();
                    
                    // generar token
                    $token = $this->generateToken($user['idUsuario'], $user['email'], $user['nombreRol']);
                    
                    return [
                        'success' => true,
                        'message' => 'login exitoso',
                        'data' => [
                            'token' => $token,
                            'user' => [
                                'id' => $user['idUsuario'],
                                'nombre' => $user['nombreUsuario'],
                                'email' => $user['email'],
                                'rol' => $user['nombreRol'],
                                'idRol' => $user['idRol']
                            ]
                        ]
                    ];
                }
            }
            
            return [
                'success' => false,
                'message' => 'credenciales incorrectas'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error en login: ' . $e->getMessage()
            ];
        }
    }
    
    // registrar nuevo usuario
    public function register($nombre, $email, $password, $idRol = 2) {
        try {
            // verificar si el email ya existe
            $checkQuery = "SELECT idUsuario FROM usuarios WHERE email = :email";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindParam(':email', $email);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'el email ya esta registrado'
                ];
            }
            
            // hashear password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            // insertar usuario
            $query = "INSERT INTO usuarios (nombreUsuario, email, password, idRol) 
                      VALUES (:nombre, :email, :password, :idRol)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':idRol', $idRol);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'usuario registrado exitosamente',
                    'data' => ['userId' => $this->conn->lastInsertId()]
                ];
            }
            
            return [
                'success' => false,
                'message' => 'error al registrar usuario'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error en registro: ' . $e->getMessage()
            ];
        }
    }
}

// procesar request
$method = $_SERVER['REQUEST_METHOD'];
$auth = new Auth();

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        if ($data['action'] === 'login') {
            $result = $auth->login($data['email'], $data['password']);
            echo json_encode($result);
        } elseif ($data['action'] === 'register') {
            $result = $auth->register(
                $data['nombre'],
                $data['email'],
                $data['password'],
                $data['idRol'] ?? 2
            );
            echo json_encode($result);
        }
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'metodo no permitido'
    ]);
}
