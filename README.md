# 🛒 Sistema de Tienda de Abarrotes

Sistema web completo para gestión de tienda de abarrotes con interfaz moderna, animaciones espectaculares y funcionalidades completas.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz premium con animaciones fluidas usando Framer Motion
- 🔐 **Sistema de Autenticación**: Login seguro con roles (Administrador, Cajero, Almacenista)
- 📊 **Dashboard Interactivo**: Estadísticas en tiempo real con gráficas animadas
- 📦 **Gestión de Productos**: CRUD completo con búsqueda y filtros
- 🛍️ **Punto de Venta (POS)**: Carrito interactivo con cálculo automático
- 👥 **Gestión de Clientes**: Registro y seguimiento de clientes frecuentes
- 📈 **Reportes Visuales**: Gráficas de ventas y productos más vendidos
- 🎭 **Animaciones Premium**: Efectos glassmorphism, partículas y transiciones suaves

## 🛠️ Tecnologías

### Backend

- PHP 7.4+
- MySQL 5.7+
- API REST

### Frontend

- React 18
- Vite
- Framer Motion (animaciones)
- Recharts (gráficas)
- Axios (HTTP)
- React Router (navegación)

## 📋 Requisitos Previos

- XAMPP (Apache + MySQL)
- Node.js 16+ y npm
- Navegador web moderno

## 🚀 Instalación

### 1. Base de Datos

Opción A - Usando línea de comandos (MariaDB):

```bash
mysql -u root -p
# password: e2gk8ann86
source c:/xampp/htdocs/Tienda/database/tienda_abarrotes.sql
exit
```

Opción B - Usando phpMyAdmin:

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Usuario: `root`, Password: `e2gk8ann86`
3. Importa el archivo: `database/tienda_abarrotes.sql`
4. Verifica que la base de datos `tienda_abarrotes` se haya creado correctamente

### 2. Backend PHP

El backend ya está configurado en `c:\xampp\htdocs\Tienda\backend`

Verifica que Apache esté corriendo en XAMPP.

### 3. Frontend React

```bash
# navegar a la carpeta del frontend
cd c:\xampp\htdocs\Tienda\tienda-frontend

# instalar dependencias
npm install

# iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔑 Credenciales de Prueba

**Usuario Administrador:**

- Email: `admin@tienda.com`
- Password: `admin123`

## 📁 Estructura del Proyecto

```
Tienda/
├── backend/
│   ├── config/
│   │   ├── config.php          # configuración de BD y CORS
│   │   └── Database.php        # clase de conexión PDO
│   └── api/
│       ├── auth.php            # autenticación y registro
│       ├── productos.php       # CRUD de productos
│       ├── ventas.php          # gestión de ventas
│       ├── categorias.php      # categorías
│       └── clientes.php        # gestión de clientes
├── database/
│   └── tienda_abarrotes.sql   # script de base de datos
└── tienda-frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx      # layout principal con sidebar
    │   ├── pages/
    │   │   ├── Login.jsx       # página de login animada
    │   │   ├── Dashboard.jsx   # dashboard con estadísticas
    │   │   ├── Productos.jsx   # gestión de productos
    │   │   ├── Ventas.jsx      # punto de venta (POS)
    │   │   ├── Clientes.jsx    # gestión de clientes
    │   │   └── Reportes.jsx    # reportes y gráficas
    │   ├── services/
    │   │   └── api.js          # servicios HTTP con Axios
    │   ├── App.jsx             # componente principal
    │   └── main.jsx            # punto de entrada
    └── package.json
```

## 🎯 Funcionalidades por Módulo

### Dashboard

- Ventas del día y del mes
- Productos más vendidos
- Alertas de stock bajo
- Gráficas animadas
- Acciones rápidas

### Productos

- Crear, editar y eliminar productos
- Búsqueda por nombre o código de barras
- Filtrar por categoría
- Control de stock
- Alertas de inventario bajo

### Punto de Venta (POS)

- Búsqueda rápida de productos
- Carrito interactivo con animaciones
- Cálculo automático de totales e IVA
- Selección de cliente y método de pago
- Actualización automática de inventario

### Clientes

- Visualización de clientes registrados
- Sistema de puntos
- Información de contacto

### Reportes

- Estadísticas de ventas
- Gráficas de productos más vendidos
- Distribución de ventas (pie chart)
- Historial de transacciones

## 🎨 Características de Diseño

- **Gradientes Vibrantes**: Colores modernos y atractivos
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsive**: Adaptable a móviles y tablets
- **Partículas Animadas**: Efectos visuales en el login
- **Micro-interacciones**: Hover effects y feedback visual

## 🔧 Configuración Adicional

### Cambiar URL del Backend

Si necesitas cambiar la URL del backend, edita el archivo:
`tienda-frontend/src/services/api.js`

```javascript
const API_URL = 'http://localhost/Tienda/backend/api'
```

### Agregar Nuevos Roles

Edita la tabla `roles` en la base de datos y actualiza el sistema de permisos según necesites.

## 📝 Notas Importantes

- El sistema usa **soft delete** para productos (no se eliminan físicamente)
- Las ventas actualizan automáticamente el inventario
- Se registran todos los movimientos de inventario
- El IVA está configurado al 16%
- Los precios se manejan con 2 decimales

## 🐛 Solución de Problemas

### Error de CORS

Verifica que el archivo `backend/config/config.php` tenga los headers CORS correctos.

### Error de Conexión a BD

Verifica las credenciales en `backend/config/config.php`:

- DB_HOST: localhost
- DB_USER: root
- DB_PASS: e2gk8ann86
- DB_NAME: tienda_abarrotes

### npm install falla

Intenta:

```bash
npm cache clean --force
npm install
```

## 📧 Soporte

Para cualquier duda o problema, revisa:

1. Que XAMPP esté corriendo (Apache y MySQL)
2. Que la base de datos esté importada correctamente
3. Que las dependencias de npm estén instaladas
4. Que no haya errores en la consola del navegador

## 🎉 ¡Listo

El sistema está completo y listo para usar. Disfruta de tu tienda de abarrotes con un diseño espectacular y animaciones profesionales.
