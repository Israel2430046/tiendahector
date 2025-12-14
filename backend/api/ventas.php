<?php
require_once '../config/config.php';
require_once '../config/Database.php';

class Ventas {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }
    
    // generar folio unico
    private function generarFolio() {
        $fecha = date('Ymd');
        $random = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        return "V{$fecha}{$random}";
    }
    
    // crear venta
    public function create($data) {
        try {
            $this->conn->beginTransaction();
            
            // generar folio
            $folio = $this->generarFolio();
            
            // insertar venta
            $query = "INSERT INTO ventas (folio, idUsuario, idCliente, subtotal, descuento, impuesto, total, metodoPago)
                      VALUES (:folio, :usuario, :cliente, :subtotal, :descuento, :impuesto, :total, :metodo)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':folio', $folio);
            $stmt->bindParam(':usuario', $data['idUsuario']);
            $stmt->bindParam(':cliente', $data['idCliente']);
            $stmt->bindParam(':subtotal', $data['subtotal']);
            $stmt->bindParam(':descuento', $data['descuento']);
            $stmt->bindParam(':impuesto', $data['impuesto']);
            $stmt->bindParam(':total', $data['total']);
            $stmt->bindParam(':metodo', $data['metodoPago']);
            $stmt->execute();
            
            $idVenta = $this->conn->lastInsertId();
            
            // insertar detalle de venta y actualizar stock
            $queryDetalle = "INSERT INTO detalleVentas (idVenta, idProducto, cantidad, precioUnitario, subtotal)
                            VALUES (:venta, :producto, :cantidad, :precio, :subtotal)";
            
            $queryStock = "UPDATE productos SET stock = stock - :cantidad WHERE idProducto = :producto";
            
            $queryMovimiento = "INSERT INTO movimientosInventario (idProducto, tipoMovimiento, cantidad, stockAnterior, stockNuevo, idUsuario, referencia)
                               VALUES (:producto, 'venta', :cantidad, :stockAnterior, :stockNuevo, :usuario, :referencia)";
            
            $stmtDetalle = $this->conn->prepare($queryDetalle);
            $stmtStock = $this->conn->prepare($queryStock);
            $stmtMovimiento = $this->conn->prepare($queryMovimiento);
            
            foreach ($data['productos'] as $producto) {
                // obtener stock actual
                $queryStockActual = "SELECT stock FROM productos WHERE idProducto = :id";
                $stmtStockActual = $this->conn->prepare($queryStockActual);
                $stmtStockActual->bindParam(':id', $producto['idProducto']);
                $stmtStockActual->execute();
                $stockActual = $stmtStockActual->fetch()['stock'];
                
                // insertar detalle
                $stmtDetalle->bindParam(':venta', $idVenta);
                $stmtDetalle->bindParam(':producto', $producto['idProducto']);
                $stmtDetalle->bindParam(':cantidad', $producto['cantidad']);
                $stmtDetalle->bindParam(':precio', $producto['precioUnitario']);
                $stmtDetalle->bindParam(':subtotal', $producto['subtotal']);
                $stmtDetalle->execute();
                
                // actualizar stock
                $stmtStock->bindParam(':cantidad', $producto['cantidad']);
                $stmtStock->bindParam(':producto', $producto['idProducto']);
                $stmtStock->execute();
                
                // registrar movimiento
                $stockNuevo = $stockActual - $producto['cantidad'];
                $stmtMovimiento->bindParam(':producto', $producto['idProducto']);
                $stmtMovimiento->bindParam(':cantidad', $producto['cantidad']);
                $stmtMovimiento->bindParam(':stockAnterior', $stockActual);
                $stmtMovimiento->bindParam(':stockNuevo', $stockNuevo);
                $stmtMovimiento->bindParam(':usuario', $data['idUsuario']);
                $stmtMovimiento->bindParam(':referencia', $folio);
                $stmtMovimiento->execute();
            }
            
            $this->conn->commit();
            
            return [
                'success' => true,
                'message' => 'venta registrada exitosamente',
                'data' => [
                    'idVenta' => $idVenta,
                    'folio' => $folio
                ]
            ];
            
        } catch(PDOException $e) {
            $this->conn->rollBack();
            return [
                'success' => false,
                'message' => 'error al registrar venta: ' . $e->getMessage()
            ];
        }
    }
    
    // obtener ventas
    public function getAll($fechaInicio = null, $fechaFin = null) {
        try {
            $query = "SELECT v.*, u.nombreUsuario, c.nombreCliente
                      FROM ventas v
                      LEFT JOIN usuarios u ON v.idUsuario = u.idUsuario
                      LEFT JOIN clientes c ON v.idCliente = c.idCliente
                      WHERE 1=1";
            
            if ($fechaInicio && $fechaFin) {
                $query .= " AND DATE(v.fechaVenta) BETWEEN :inicio AND :fin";
            }
            
            $query .= " ORDER BY v.fechaVenta DESC LIMIT 100";
            
            $stmt = $this->conn->prepare($query);
            
            if ($fechaInicio && $fechaFin) {
                $stmt->bindParam(':inicio', $fechaInicio);
                $stmt->bindParam(':fin', $fechaFin);
            }
            
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener ventas: ' . $e->getMessage()
            ];
        }
    }
    
    // obtener detalle de venta
    public function getDetalle($idVenta) {
        try {
            $query = "SELECT dv.*, p.nombreProducto
                      FROM detalleVentas dv
                      INNER JOIN productos p ON dv.idProducto = p.idProducto
                      WHERE dv.idVenta = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $idVenta);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener detalle: ' . $e->getMessage()
            ];
        }
    }
    
    // estadisticas de ventas
    public function getEstadisticas() {
        try {
            // ventas del dia
            $queryHoy = "SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
                        FROM ventas WHERE DATE(fechaVenta) = CURDATE()";
            $stmtHoy = $this->conn->query($queryHoy);
            $ventasHoy = $stmtHoy->fetch();
            
            // ventas del mes
            $queryMes = "SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
                        FROM ventas WHERE MONTH(fechaVenta) = MONTH(CURDATE()) 
                        AND YEAR(fechaVenta) = YEAR(CURDATE())";
            $stmtMes = $this->conn->query($queryMes);
            $ventasMes = $stmtMes->fetch();
            
            // productos mas vendidos
            $queryTop = "SELECT p.nombreProducto, SUM(dv.cantidad) as totalVendido
                        FROM detalleVentas dv
                        INNER JOIN productos p ON dv.idProducto = p.idProducto
                        INNER JOIN ventas v ON dv.idVenta = v.idVenta
                        WHERE DATE(v.fechaVenta) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                        GROUP BY dv.idProducto
                        ORDER BY totalVendido DESC
                        LIMIT 5";
            $stmtTop = $this->conn->query($queryTop);
            $topProductos = $stmtTop->fetchAll();
            
            return [
                'success' => true,
                'data' => [
                    'hoy' => [
                        'total' => (int) $ventasHoy['total'],
                        'monto' => (float) $ventasHoy['monto']
                    ],
                    'mes' => [
                        'total' => (int) $ventasMes['total'],
                        'monto' => (float) $ventasMes['monto']
                    ],
                    'topProductos' => array_map(function($prod) {
                        $prod['totalVendido'] = (int) $prod['totalVendido'];
                        return $prod;
                    }, $topProductos)
                ]
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'error al obtener estadisticas: ' . $e->getMessage()
            ];
        }
    }
}

// procesar request
$method = $_SERVER['REQUEST_METHOD'];
$ventas = new Ventas();

switch ($method) {
    case 'GET':
        if (isset($_GET['detalle'])) {
            $result = $ventas->getDetalle($_GET['detalle']);
        } elseif (isset($_GET['estadisticas'])) {
            $result = $ventas->getEstadisticas();
        } else {
            $inicio = $_GET['fechaInicio'] ?? null;
            $fin = $_GET['fechaFin'] ?? null;
            $result = $ventas->getAll($inicio, $fin);
        }
        echo json_encode($result);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $ventas->create($data);
        echo json_encode($result);
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'metodo no permitido'
        ]);
}
