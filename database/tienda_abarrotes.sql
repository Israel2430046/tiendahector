-- base de datos para sistema de tienda de abarrotes
-- creado: 2025-12-14

DROP DATABASE IF EXISTS tienda_abarrotes;
CREATE DATABASE tienda_abarrotes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_abarrotes;

-- tabla de roles
CREATE TABLE roles (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    nombreRol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- tabla de usuarios con sistema de roles
CREATE TABLE usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombreUsuario VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    idRol INT NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimoAcceso TIMESTAMP NULL,
    FOREIGN KEY (idRol) REFERENCES roles(idRol)
) ENGINE=InnoDB;

-- tabla de categorías de productos
CREATE TABLE categorias (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    nombreCategoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- tabla de proveedores
CREATE TABLE proveedores (
    idProveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombreProveedor VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- tabla de productos
CREATE TABLE productos (
    idProducto INT PRIMARY KEY AUTO_INCREMENT,
    codigoBarras VARCHAR(50) UNIQUE,
    nombreProducto VARCHAR(200) NOT NULL,
    descripcion TEXT,
    idCategoria INT NOT NULL,
    idProveedor INT,
    precioCompra DECIMAL(10,2) NOT NULL,
    precioVenta DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    stockMinimo INT DEFAULT 5,
    unidadMedida VARCHAR(20) DEFAULT 'pieza',
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria),
    FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor)
) ENGINE=InnoDB;

-- tabla de clientes
CREATE TABLE clientes (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nombreCliente VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    rfc VARCHAR(20),
    puntos INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- tabla de ventas
CREATE TABLE ventas (
    idVenta INT PRIMARY KEY AUTO_INCREMENT,
    folio VARCHAR(50) UNIQUE NOT NULL,
    idUsuario INT NOT NULL,
    idCliente INT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuesto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    metodoPago VARCHAR(50) DEFAULT 'efectivo',
    estadoVenta VARCHAR(30) DEFAULT 'completada',
    fechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
) ENGINE=InnoDB;

-- tabla de detalle de ventas
CREATE TABLE detalleVentas (
    idDetalle INT PRIMARY KEY AUTO_INCREMENT,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
) ENGINE=InnoDB;

-- tabla de compras a proveedores
CREATE TABLE compras (
    idCompra INT PRIMARY KEY AUTO_INCREMENT,
    folioCompra VARCHAR(50) UNIQUE NOT NULL,
    idProveedor INT NOT NULL,
    idUsuario INT NOT NULL,
    totalCompra DECIMAL(10,2) NOT NULL,
    estadoCompra VARCHAR(30) DEFAULT 'recibida',
    fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
) ENGINE=InnoDB;

-- tabla de detalle de compras
CREATE TABLE detalleCompras (
    idDetalleCompra INT PRIMARY KEY AUTO_INCREMENT,
    idCompra INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCompra) REFERENCES compras(idCompra) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
) ENGINE=InnoDB;

-- tabla de movimientos de inventario
CREATE TABLE movimientosInventario (
    idMovimiento INT PRIMARY KEY AUTO_INCREMENT,
    idProducto INT NOT NULL,
    tipoMovimiento VARCHAR(30) NOT NULL,
    cantidad INT NOT NULL,
    stockAnterior INT NOT NULL,
    stockNuevo INT NOT NULL,
    idUsuario INT NOT NULL,
    referencia VARCHAR(100),
    fechaMovimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
) ENGINE=InnoDB;

-- insertar roles por defecto
INSERT INTO roles (nombreRol, descripcion) VALUES
('Administrador', 'acceso total al sistema'),
('Cajero', 'acceso a ventas y consultas'),
('Almacenista', 'acceso a inventario y compras');

-- insertar usuario administrador por defecto
-- password: admin123 (hasheado con password_hash)
INSERT INTO usuarios (nombreUsuario, email, password, idRol) VALUES
('Administrador', 'admin@tienda.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- insertar categorías por defecto
INSERT INTO categorias (nombreCategoria, descripcion, icono) VALUES
('Lácteos', 'leche, queso, yogurt', '🥛'),
('Bebidas', 'refrescos, jugos, agua', '🥤'),
('Snacks', 'papas, dulces, galletas', '🍿'),
('Panadería', 'pan, pasteles, tortillas', '🍞'),
('Limpieza', 'detergentes, jabones', '🧼'),
('Abarrotes', 'arroz, frijol, aceite', '🛒'),
('Carnes y Embutidos', 'pollo, res, jamón', '🥩'),
('Frutas y Verduras', 'productos frescos', '🥬');

-- insertar proveedor de ejemplo
INSERT INTO proveedores (nombreProveedor, contacto, telefono, email) VALUES
('Distribuidora Central', 'Juan Pérez', '5551234567', 'ventas@distribuidora.com'),
('Lácteos del Valle', 'María González', '5559876543', 'contacto@lacteosv.com');

-- insertar productos de ejemplo
INSERT INTO productos (codigoBarras, nombreProducto, descripcion, idCategoria, idProveedor, precioCompra, precioVenta, stock, stockMinimo) VALUES
('7501234567890', 'Leche Entera 1L', 'leche pasteurizada', 1, 2, 18.00, 25.00, 50, 10),
('7501234567891', 'Coca Cola 600ml', 'refresco de cola', 2, 1, 10.00, 15.00, 100, 20),
('7501234567892', 'Sabritas Original 45g', 'papas fritas', 3, 1, 8.00, 12.00, 80, 15),
('7501234567893', 'Pan Blanco', 'pan de caja', 4, 1, 25.00, 35.00, 30, 10),
('7501234567894', 'Fabuloso 1L', 'limpiador multiusos', 5, 1, 15.00, 22.00, 40, 8),
('7501234567895', 'Arroz 1kg', 'arroz blanco', 6, 1, 18.00, 25.00, 60, 15),
('7501234567896', 'Jamón Virginia 250g', 'jamón de pavo', 7, 1, 35.00, 50.00, 25, 5),
('7501234567897', 'Manzana Red kg', 'manzana roja', 8, 1, 25.00, 35.00, 40, 10);

-- insertar cliente de ejemplo
INSERT INTO clientes (nombreCliente, telefono, email) VALUES
('Cliente General', NULL, NULL),
('María López', '5551112233', 'maria@email.com');

-- índices para mejorar rendimiento
CREATE INDEX idx_productos_categoria ON productos(idCategoria);
CREATE INDEX idx_productos_codigo ON productos(codigoBarras);
CREATE INDEX idx_ventas_fecha ON ventas(fechaVenta);
CREATE INDEX idx_ventas_usuario ON ventas(idUsuario);
CREATE INDEX idx_detalle_venta ON detalleVentas(idVenta);
CREATE INDEX idx_movimientos_producto ON movimientosInventario(idProducto);
