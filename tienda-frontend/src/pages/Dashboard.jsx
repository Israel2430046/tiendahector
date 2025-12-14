import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Package,
    ShoppingCart,
    Users,
    AlertTriangle,
    DollarSign,
    ArrowUp,
    ArrowDown
} from 'lucide-react'
import { getEstadisticasVentas, getProductosLowStock } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Dashboard.css'

function Dashboard({ user }) {
    const [estadisticas, setEstadisticas] = useState(null)
    const [productosLowStock, setProductosLowStock] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [statsRes, lowStockRes] = await Promise.all([
                getEstadisticasVentas(),
                getProductosLowStock()
            ])

            if (statsRes.success) {
                setEstadisticas(statsRes.data)
            }

            if (lowStockRes.success) {
                setProductosLowStock(lowStockRes.data)
            }
        } catch (error) {
            console.error('error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>cargando dashboard...</p>
            </div>
        )
    }

    return (
        <motion.div
            className="dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* header */}
            <motion.div className="dashboard-header" variants={itemVariants}>
                <div>
                    <h1 className="page-title">dashboard</h1>
                    <p className="page-subtitle">bienvenido, {user?.nombre}</p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('es-MX', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </motion.div>

            {/* tarjetas de estadisticas */}
            <div className="stats-grid">
                <motion.div className="stat-card card hover-lift" variants={itemVariants}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <DollarSign size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">ventas hoy</p>
                        <h3 className="stat-value">
                            ${Number(estadisticas?.hoy?.monto || 0).toFixed(2)}
                        </h3>
                        <div className="stat-footer">
                            <span className="stat-badge badge-success">
                                <ArrowUp size={14} />
                                {estadisticas?.hoy?.total || 0} transacciones
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card card hover-lift" variants={itemVariants}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <ShoppingCart size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">ventas del mes</p>
                        <h3 className="stat-value">
                            ${Number(estadisticas?.mes?.monto || 0).toFixed(2)}
                        </h3>
                        <div className="stat-footer">
                            <span className="stat-badge badge-success">
                                <ArrowUp size={14} />
                                {estadisticas?.mes?.total || 0} ventas
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card card hover-lift" variants={itemVariants}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <Package size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">productos</p>
                        <h3 className="stat-value">{estadisticas?.topProductos?.length || 0}</h3>
                        <div className="stat-footer">
                            <span className="stat-badge badge-warning">
                                <AlertTriangle size={14} />
                                {productosLowStock.length} stock bajo
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card card hover-lift" variants={itemVariants}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                        <TrendingUp size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">promedio venta</p>
                        <h3 className="stat-value">
                            ${estadisticas?.hoy?.total > 0
                                ? (Number(estadisticas.hoy.monto) / Number(estadisticas.hoy.total)).toFixed(2)
                                : '0.00'}
                        </h3>
                        <div className="stat-footer">
                            <span className="stat-badge badge-success">
                                <ArrowUp size={14} />
                                por transacción
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* graficas y alertas */}
            <div className="dashboard-grid">
                {/* productos mas vendidos */}
                <motion.div className="card chart-card" variants={itemVariants}>
                    <h3 className="card-title">
                        <TrendingUp size={20} />
                        productos más vendidos
                    </h3>
                    {estadisticas?.topProductos?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={estadisticas.topProductos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="nombreProducto"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="totalVendido" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <Package size={48} color="#cbd5e1" />
                            <p>no hay datos de ventas</p>
                        </div>
                    )}
                </motion.div>

                {/* alertas de stock bajo */}
                <motion.div className="card alert-card" variants={itemVariants}>
                    <h3 className="card-title">
                        <AlertTriangle size={20} />
                        alertas de inventario
                    </h3>
                    <div className="alert-list">
                        {productosLowStock.length > 0 ? (
                            productosLowStock.slice(0, 5).map((producto, index) => (
                                <motion.div
                                    key={producto.idProducto}
                                    className="alert-item"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="alert-info">
                                        <p className="alert-name">{producto.nombreProducto}</p>
                                        <p className="alert-category">{producto.nombreCategoria}</p>
                                    </div>
                                    <div className="alert-stock">
                                        <span className={`badge ${producto.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                                            {producto.stock} unidades
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <Package size={48} color="#cbd5e1" />
                                <p>todos los productos tienen stock suficiente</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* acciones rapidas */}
            <motion.div className="quick-actions" variants={itemVariants}>
                <h3 className="section-title">acciones rápidas</h3>
                <div className="actions-grid">
                    <motion.a
                        href="/ventas"
                        className="action-card card hover-lift"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ShoppingCart size={32} />
                        <h4>nueva venta</h4>
                        <p>registrar venta</p>
                    </motion.a>

                    <motion.a
                        href="/productos"
                        className="action-card card hover-lift"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Package size={32} />
                        <h4>productos</h4>
                        <p>gestionar inventario</p>
                    </motion.a>

                    <motion.a
                        href="/clientes"
                        className="action-card card hover-lift"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Users size={32} />
                        <h4>clientes</h4>
                        <p>ver clientes</p>
                    </motion.a>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Dashboard
