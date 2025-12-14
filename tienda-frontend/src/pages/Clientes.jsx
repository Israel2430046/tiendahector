import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Mail, Phone, MapPin } from 'lucide-react'
import { getClientes } from '../services/api'
import './Clientes.css'

function Clientes() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarClientes()
    }, [])

    const cargarClientes = async () => {
        try {
            const res = await getClientes()
            if (res.success) setClientes(res.data)
        } catch (error) {
            console.error('error al cargar clientes:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="clientes-page">
            <motion.div
                className="page-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div>
                    <h1 className="page-title">
                        <Users size={32} />
                        clientes
                    </h1>
                    <p className="page-subtitle">gestión de clientes</p>
                </div>
            </motion.div>

            <motion.div
                className="clientes-grid"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    clientes.map((cliente, index) => (
                        <motion.div
                            key={cliente.idCliente}
                            className="cliente-card card hover-lift"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="cliente-avatar">
                                {cliente.nombreCliente.charAt(0).toUpperCase()}
                            </div>
                            <div className="cliente-info">
                                <h3>{cliente.nombreCliente}</h3>
                                {cliente.email && (
                                    <p className="cliente-detail">
                                        <Mail size={16} />
                                        {cliente.email}
                                    </p>
                                )}
                                {cliente.telefono && (
                                    <p className="cliente-detail">
                                        <Phone size={16} />
                                        {cliente.telefono}
                                    </p>
                                )}
                                {cliente.direccion && (
                                    <p className="cliente-detail">
                                        <MapPin size={16} />
                                        {cliente.direccion}
                                    </p>
                                )}
                                <div className="cliente-puntos">
                                    <span className="badge badge-success">
                                        {cliente.puntos || 0} puntos
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    )
}

export default Clientes
