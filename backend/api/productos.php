<?php
require_once '../config/config.php';
require_once '../config/Database.php';

class Productos {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }
    
    // obtener todos los productos
    public function getAll($categoria = null, $busqueda = null) {
        try {
            $query = "SELECT p.*, c.nombreCategoria, pr.nombreProveedor
                      FROM productos p
                      LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
                      LEFT JOIN proveedores pr ON p.idProveedor = pr.idProveedor
                      WHERE p.activo = 1";
            
            if ($categoria) {
                $query .= " AND p.idCategoria = :categoria";
            }
            
            if ($busqueda) {
                $query .= " AND (p.nombreProducto LIKE :busqueda OR p.codigoBarras LIKE :busqueda)";
            }
            
            $query .= " ORDER BY p.nombreProducto ASC";
            
            $stmt = $this->conn->prepare($query);
            
            if ($categoria) {
                $stmt->bindParam(':categoria', $categoria);
            }
            
            if ($busqueda) {
                $searchTerm = "%{$busqueda}%";
                $stmt->bindParam(':busqueda', $searchTerm);
            }
            
            $stmt->execute();
            $productos = $stmt->fetchAll();
            
            return [
                'success' => true,
                'data' => $productos
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener productos: ' . $e->getMessage()
            ];
        }
    }
    
    // obtener producto por id
    public function getById($id) {
        try {
            $query = "SELECT p.*, c.nombreCategoria, pr.nombreProveedor
                      FROM productos p
                      LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
                      LEFT JOIN proveedores pr ON p.idProveedor = pr.idProveedor
                      WHERE p.idProducto = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'data' => $stmt->fetch()
                ];
            }
            
            return [
                'success' => false,
                'message' => 'producto no encontrado'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener producto: ' . $e->getMessage()
            ];
        }
    }
    
    // crear producto
    public function create($data) {
        try {
            $query = "INSERT INTO productos (codigoBarras, nombreProducto, descripcion, 
                      idCategoria, idProveedor, precioCompra, precioVenta, stock, stockMinimo, unidadMedida)
                      VALUES (:codigo, :nombre, :descripcion, :categoria, :proveedor, 
                      :precioCompra, :precioVenta, :stock, :stockMinimo, :unidad)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':codigo', $data['codigoBarras']);
            $stmt->bindParam(':nombre', $data['nombreProducto']);
            $stmt->bindParam(':descripcion', $data['descripcion']);
            $stmt->bindParam(':categoria', $data['idCategoria']);
            $stmt->bindParam(':proveedor', $data['idProveedor']);
            $stmt->bindParam(':precioCompra', $data['precioCompra']);
            $stmt->bindParam(':precioVenta', $data['precioVenta']);
            $stmt->bindParam(':stock', $data['stock']);
            $stmt->bindParam(':stockMinimo', $data['stockMinimo']);
            $stmt->bindParam(':unidad', $data['unidadMedida']);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'producto creado exitosamente',
                    'data' => ['id' => $this->conn->lastInsertId()]
                ];
            }
            
            return [
                'success' => false,
                'message' => 'error al crear producto'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al crear producto: ' . $e->getMessage()
            ];
        }
    }
    
    // actualizar producto
    public function update($id, $data) {
        try {
            $query = "UPDATE productos SET 
                      nombreProducto = :nombre,
                      descripcion = :descripcion,
                      idCategoria = :categoria,
                      idProveedor = :proveedor,
                      precioCompra = :precioCompra,
                      precioVenta = :precioVenta,
                      stock = :stock,
                      stockMinimo = :stockMinimo,
                      unidadMedida = :unidad
                      WHERE idProducto = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nombre', $data['nombreProducto']);
            $stmt->bindParam(':descripcion', $data['descripcion']);
            $stmt->bindParam(':categoria', $data['idCategoria']);
            $stmt->bindParam(':proveedor', $data['idProveedor']);
            $stmt->bindParam(':precioCompra', $data['precioCompra']);
            $stmt->bindParam(':precioVenta', $data['precioVenta']);
            $stmt->bindParam(':stock', $data['stock']);
            $stmt->bindParam(':stockMinimo', $data['stockMinimo']);
            $stmt->bindParam(':unidad', $data['unidadMedida']);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'producto actualizado exitosamente'
                ];
            }
            
            return [
                'success' => false,
                'message' => 'error al actualizar producto'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al actualizar producto: ' . $e->getMessage()
            ];
        }
    }
    
    // eliminar producto (soft delete)
    public function delete($id) {
        try {
            $query = "UPDATE productos SET activo = 0 WHERE idProducto = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'producto eliminado exitosamente'
                ];
            }
            
            return [
                'success' => false,
                'message' => 'error al eliminar producto'
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al eliminar producto: ' . $e->getMessage()
            ];
        }
    }
    
    // obtener productos con stock bajo
    public function getLowStock() {
        try {
            $query = "SELECT p.*, c.nombreCategoria
                      FROM productos p
                      LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
                      WHERE p.stock <= p.stockMinimo AND p.activo = 1
                      ORDER BY p.stock ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener productos: ' . $e->getMessage()
            ];
        }
    }
}

// procesar request
$method = $_SERVER['REQUEST_METHOD'];
$productos = new Productos();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $productos->getById($_GET['id']);
        } elseif (isset($_GET['lowStock'])) {
            $result = $productos->getLowStock();
        } else {
            $categoria = $_GET['categoria'] ?? null;
            $busqueda = $_GET['busqueda'] ?? null;
            $result = $productos->getAll($categoria, $busqueda);
        }
        echo json_encode($result);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $productos->create($data);
        echo json_encode($result);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['idProducto'] ?? null;
        if ($id) {
            $result = $productos->update($id, $data);
            echo json_encode($result);
        }
        break;
        
    case 'DELETE':
        if (isset($_GET['id'])) {
            $result = $productos->delete($_GET['id']);
            echo json_encode($result);
        }
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'metodo no permitido'
        ]);
}
