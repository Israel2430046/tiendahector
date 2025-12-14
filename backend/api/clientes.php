<?php
require_once '../config/config.php';
require_once '../config/Database.php';

class Clientes {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }
    
    // obtener todos los clientes
    public function getAll() {
        try {
            $query = "SELECT * FROM clientes WHERE activo = 1 ORDER BY nombreCliente ASC";
            $stmt = $this->conn->query($query);
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener clientes: ' . $e->getMessage()
            ];
        }
    }
    
    // crear cliente
    public function create($data) {
        try {
            $query = "INSERT INTO clientes (nombreCliente, telefono, email, direccion, rfc)
                      VALUES (:nombre, :telefono, :email, :direccion, :rfc)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':nombre', $data['nombreCliente']);
            $stmt->bindParam(':telefono', $data['telefono']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':direccion', $data['direccion']);
            $stmt->bindParam(':rfc', $data['rfc']);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'cliente creado exitosamente',
                    'data' => ['id' => $this->conn->lastInsertId()]
                ];
            }
            
            return [
                'success' => false,
                'message' => 'error al crear cliente'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al crear cliente: ' . $e->getMessage()
            ];
        }
    }
}

// procesar request
$method = $_SERVER['REQUEST_METHOD'];
$clientes = new Clientes();

switch ($method) {
    case 'GET':
        $result = $clientes->getAll();
        echo json_encode($result);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $clientes->create($data);
        echo json_encode($result);
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'metodo no permitido'
        ]);
}
