import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart,
    Search,
    Plus,
    Minus,
    Trash2,
    DollarSign,
    Check,
    X
} from 'lucide-react'
import { getProductos, getClientes, createVenta } from '../services/api'
import './Ventas.css'

function Ventas({ user }) {
    const [productos, setProductos] = useState([])
    const [clientes, setClientes] = useState([])
    const [carrito, setCarrito] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [clienteSeleccionado, setClienteSeleccionado] = useState('1')
    const [metodoPago, setMetodoPago] = useState('efectivo')
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [prodRes, cliRes] = await Promise.all([
                getProductos(),
                getClientes()
            ])

            if (prodRes.success) setProductos(prodRes.data)
            if (cliRes.success) setClientes(cliRes.data)
        } catch (error) {
            console.error('error al cargar datos:', error)
        }
    }

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.idProducto === producto.idProducto)

        if (existe) {
            if (existe.cantidad < producto.stock) {
                setCarrito(carrito.map(item =>
                    item.idProducto === producto.idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                ))
            }
        } else {
            setCarrito([...carrito, {
                idProducto: producto.idProducto,
                nombreProducto: producto.nombreProducto,
                precioUnitario: parseFloat(producto.precioVenta),
                cantidad: 1,
                stockDisponible: producto.stock
            }])
        }
    }

    const modificarCantidad = (idProducto, delta) => {
        setCarrito(carrito.map(item => {
            if (item.idProducto === idProducto) {
                const nuevaCantidad = item.cantidad + delta
                if (nuevaCantidad > 0 && nuevaCantidad <= item.stockDisponible) {
                    return { ...item, cantidad: nuevaCantidad }
                }
            }
            return item
        }))
    }

    const eliminarDelCarrito = (idProducto) => {
        setCarrito(carrito.filter(item => item.idProducto !== idProducto))
    }

    const calcularSubtotal = () => {
        return carrito.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
    }

    const calcularImpuesto = () => {
        return calcularSubtotal() * 0.16
    }

    const calcularTotal = () => {
        return calcularSubtotal() + calcularImpuesto()
    }

    const procesarVenta = async () => {
        if (carrito.length === 0) {
            alert('el carrito está vacío')
            return
        }

        setLoading(true)

        try {
            const venta = {
                idUsuario: user.id,
                idCliente: parseInt(clienteSeleccionado),
                subtotal: calcularSubtotal(),
                descuento: 0,
                impuesto: calcularImpuesto(),
                total: calcularTotal(),
                metodoPago: metodoPago,
                productos: carrito.map(item => ({
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    subtotal: item.precioUnitario * item.cantidad
                }))
            }

            const res = await createVenta(venta)

            if (res.success) {
                setShowSuccess(true)
                setCarrito([])
                setTimeout(() => setShowSuccess(false), 3000)
                cargarDatos()
            }
        } catch (error) {
            console.error('error al procesar venta:', error)
            alert('error al procesar la venta')
        } finally {
            setLoading(false)
        }
    }

    const productosFiltrados = productos.filter(p =>
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigoBarras.includes(busqueda)
    )

    return (
        <div className="ventas-page">
            <motion.div
                className="page-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div>
                    <h1 className="page-title">
                        <ShoppingCart size={32} />
                        punto de venta
                    </h1>
                    <p className="page-subtitle">registrar nueva venta</p>
                </div>
            </motion.div>

            <div className="ventas-grid">
                {/* panel de productos */}
                <motion.div
                    className="productos-panel card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            className="input"
                            placeholder="buscar producto..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="productos-grid">
                        <AnimatePresence>
                            {productosFiltrados.slice(0, 12).map((producto, index) => (
                                <motion.div
                                    key={producto.idProducto}
                                    className="producto-card"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => agregarAlCarrito(producto)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="producto-info">
                                        <h4>{producto.nombreProducto}</h4>
                                        <p className="producto-categoria">{producto.nombreCategoria}</p>
                                    </div>
                                    <div className="producto-precio">
                                        ${parseFloat(producto.precioVenta).toFixed(2)}
                                    </div>
                                    <div className="producto-stock">
                                        <span className={`badge ${producto.stock === 0 ? 'badge-danger' :
                                                producto.stock <= producto.stockMinimo ? 'badge-warning' :
                                                    'badge-success'
                                            }`}>
                                            {producto.stock} disponibles
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* panel de carrito */}
                <motion.div
                    className="carrito-panel card"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="carrito-title">
                        <ShoppingCart size={24} />
                        carrito de compra
                        {carrito.length > 0 && (
                            <span className="carrito-count">{carrito.length}</span>
                        )}
                    </h3>

                    <div className="carrito-items">
                        <AnimatePresence>
                            {carrito.length === 0 ? (
                                <motion.div
                                    className="carrito-vacio"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <ShoppingCart size={64} color="#cbd5e1" />
                                    <p>el carrito está vacío</p>
                                </motion.div>
                            ) : (
                                carrito.map((item) => (
                                    <motion.div
                                        key={item.idProducto}
                                        className="carrito-item"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        layout
                                    >
                                        <div className="item-info">
                                            <h5>{item.nombreProducto}</h5>
                                            <p>${item.precioUnitario.toFixed(2)} c/u</p>
                                        </div>

                                        <div className="item-controls">
                                            <motion.button
                                                className="btn-quantity"
                                                onClick={() => modificarCantidad(item.idProducto, -1)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Minus size={16} />
                                            </motion.button>

                                            <span className="item-cantidad">{item.cantidad}</span>

                                            <motion.button
                                                className="btn-quantity"
                                                onClick={() => modificarCantidad(item.idProducto, 1)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                disabled={item.cantidad >= item.stockDisponible}
                                            >
                                                <Plus size={16} />
                                            </motion.button>
                                        </div>

                                        <div className="item-subtotal">
                                            ${(item.precioUnitario * item.cantidad).toFixed(2)}
                                        </div>

                                        <motion.button
                                            className="btn-remove"
                                            onClick={() => eliminarDelCarrito(item.idProducto)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {carrito.length > 0 && (
                        <motion.div
                            className="carrito-footer"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <div className="form-group">
                                <label>cliente</label>
                                <select
                                    className="input"
                                    value={clienteSeleccionado}
                                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                                >
                                    {clientes.map(cliente => (
                                        <option key={cliente.idCliente} value={cliente.idCliente}>
                                            {cliente.nombreCliente}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>método de pago</label>
                                <select
                                    className="input"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <option value="efectivo">efectivo</option>
                                    <option value="tarjeta">tarjeta</option>
                                    <option value="transferencia">transferencia</option>
                                </select>
                            </div>

                            <div className="totales">
                                <div className="total-row">
                                    <span>subtotal:</span>
                                    <span>${calcularSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>IVA (16%):</span>
                                    <span>${calcularImpuesto().toFixed(2)}</span>
                                </div>
                                <div className="total-row total-final">
                                    <span>total:</span>
                                    <span>${calcularTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                className="btn btn-primary btn-procesar"
                                onClick={procesarVenta}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                                ) : (
                                    <>
                                        <DollarSign size={20} />
                                        procesar venta
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* mensaje de exito */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="success-toast"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                    >
                        <Check size={24} />
                        <span>¡venta procesada exitosamente!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Ventas
