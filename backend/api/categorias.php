<?php
require_once '../config/config.php';
require_once '../config/Database.php';

class Categorias {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }
    
    // obtener todas las categorias
    public function getAll() {
        try {
            $query = "SELECT * FROM categorias WHERE activo = 1 ORDER BY nombreCategoria ASC";
            $stmt = $this->conn->query($query);
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener categorias: ' . $e->getMessage()
            ];
        }
    }
}

// procesar request
$categorias = new Categorias();
$result = $categorias->getAll();
echo json_encode($result);
