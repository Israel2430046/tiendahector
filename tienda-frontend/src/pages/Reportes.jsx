import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react'
import { getVentas, getEstadisticasVentas } from '../services/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Reportes.css'

function Reportes() {
    const [ventas, setVentas] = useState([])
    const [estadisticas, setEstadisticas] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [ventasRes, statsRes] = await Promise.all([
                getVentas(),
                getEstadisticasVentas()
            ])

            if (ventasRes.success) setVentas(ventasRes.data)
            if (statsRes.success) setEstadisticas(statsRes.data)
        } catch (error) {
            console.error('error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

    return (
        <div className="reportes-page">
            <motion.div
                className="page-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div>
                    <h1 className="page-title">
                        <BarChart3 size={32} />
                        reportes
                    </h1>
                    <p className="page-subtitle">análisis de ventas</p>
                </div>
            </motion.div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {/* resumen */}
                    <div className="stats-grid">
                        <motion.div
                            className="stat-card card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <DollarSign size={28} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">ventas del mes</p>
                                <h3 className="stat-value">
                                    ${estadisticas?.mes?.monto?.toFixed(2) || '0.00'}
                                </h3>
                            </div>
                        </motion.div>

                        <motion.div
                            className="stat-card card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                <TrendingUp size={28} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">total transacciones</p>
                                <h3 className="stat-value">{estadisticas?.mes?.total || 0}</h3>
                            </div>
                        </motion.div>

                        <motion.div
                            className="stat-card card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                <Package size={28} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">productos vendidos</p>
                                <h3 className="stat-value">
                                    {estadisticas?.topProductos?.reduce((sum, p) => sum + parseInt(p.totalVendido), 0) || 0}
                                </h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* graficas */}
                    <div className="reportes-grid">
                        <motion.div
                            className="card chart-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
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
                                        <Tooltip />
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
                                    <p>no hay datos disponibles</p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            className="card chart-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="card-title">
                                <BarChart3 size={20} />
                                distribución de ventas
                            </h3>
                            {estadisticas?.topProductos?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={estadisticas.topProductos}
                                            dataKey="totalVendido"
                                            nameKey="nombreProducto"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {estadisticas.topProductos.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-state">
                                    <BarChart3 size={48} color="#cbd5e1" />
                                    <p>no hay datos disponibles</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* historial de ventas */}
                    <motion.div
                        className="card"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="card-title">historial de ventas recientes</h3>
                        <div className="table-container">
                            <table className="ventas-table">
                                <thead>
                                    <tr>
                                        <th>folio</th>
                                        <th>fecha</th>
                                        <th>cliente</th>
                                        <th>método pago</th>
                                        <th>total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.slice(0, 10).map((venta) => (
                                        <tr key={venta.idVenta}>
                                            <td><strong>{venta.folio}</strong></td>
                                            <td>{new Date(venta.fechaVenta).toLocaleString('es-MX')}</td>
                                            <td>{venta.nombreCliente || 'Cliente General'}</td>
                                            <td>
                                                <span className="badge badge-success">
                                                    {venta.metodoPago}
                                                </span>
                                            </td>
                                            <td>
                                                <strong>${parseFloat(venta.total).toFixed(2)}</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    )
}

export default Reportes
