import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Filter,
    DollarSign,
    Barcode
} from 'lucide-react'
import {
    getProductos,
    getCategorias,
    createProducto,
    updateProducto,
    deleteProducto
} from '../services/api'
import './Productos.css'

function Productos({ user }) {
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [productoEdit, setProductoEdit] = useState(null)
    const [formData, setFormData] = useState({
        codigoBarras: '',
        nombreProducto: '',
        descripcion: '',
        idCategoria: '',
        precioCompra: '',
        precioVenta: '',
        stock: '',
        stockMinimo: '5',
        unidadMedida: 'pieza'
    })

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                getProductos(),
                getCategorias()
            ])

            if (prodRes.success) setProductos(prodRes.data)
            if (catRes.success) setCategorias(catRes.data)
        } catch (error) {
            console.error('error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBuscar = async () => {
        setLoading(true)
        try {
            const res = await getProductos(categoriaFiltro, busqueda)
            if (res.success) setProductos(res.data)
        } catch (error) {
            console.error('error en busqueda:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                ...formData,
                idProveedor: 1,
                precioCompra: parseFloat(formData.precioCompra),
                precioVenta: parseFloat(formData.precioVenta),
                stock: parseInt(formData.stock),
                stockMinimo: parseInt(formData.stockMinimo)
            }

            const res = productoEdit
                ? await updateProducto({ ...data, idProducto: productoEdit.idProducto })
                : await createProducto(data)

            if (res.success) {
                setModalOpen(false)
                resetForm()
                cargarDatos()
            }
        } catch (error) {
            console.error('error al guardar:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (producto) => {
        setProductoEdit(producto)
        setFormData({
            codigoBarras: producto.codigoBarras,
            nombreProducto: producto.nombreProducto,
            descripcion: producto.descripcion || '',
            idCategoria: producto.idCategoria,
            precioCompra: producto.precioCompra,
            precioVenta: producto.precioVenta,
            stock: producto.stock,
            stockMinimo: producto.stockMinimo,
            unidadMedida: producto.unidadMedida
        })
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (confirm('¿estás seguro de eliminar este producto?')) {
            try {
                const res = await deleteProducto(id)
                if (res.success) cargarDatos()
            } catch (error) {
                console.error('error al eliminar:', error)
            }
        }
    }

    const resetForm = () => {
        setProductoEdit(null)
        setFormData({
            codigoBarras: '',
            nombreProducto: '',
            descripcion: '',
            idCategoria: '',
            precioCompra: '',
            precioVenta: '',
            stock: '',
            stockMinimo: '5',
            unidadMedida: 'pieza'
        })
    }

    return (
        <div className="productos-page">
            <motion.div
                className="page-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div>
                    <h1 className="page-title">
                        <Package size={32} />
                        productos
                    </h1>
                    <p className="page-subtitle">gestión de inventario</p>
                </div>
                <motion.button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm()
                        setModalOpen(true)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={20} />
                    nuevo producto
                </motion.button>
            </motion.div>

            {/* filtros */}
            <motion.div
                className="card filters-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="filters-grid">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            className="input"
                            placeholder="buscar por nombre o código..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                        />
                    </div>

                    <div className="filter-select">
                        <Filter size={20} />
                        <select
                            className="input"
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="">todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nombreCategoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <motion.button
                        className="btn btn-primary"
                        onClick={handleBuscar}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        buscar
                    </motion.button>
                </div>
            </motion.div>

            {/* tabla de productos */}
            <motion.div
                className="card productos-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="productos-table">
                            <thead>
                                <tr>
                                    <th>código</th>
                                    <th>producto</th>
                                    <th>categoría</th>
                                    <th>precio compra</th>
                                    <th>precio venta</th>
                                    <th>stock</th>
                                    <th>acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {productos.map((producto, index) => (
                                        <motion.tr
                                            key={producto.idProducto}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={producto.stock <= producto.stockMinimo ? 'low-stock' : ''}
                                        >
                                            <td>
                                                <div className="codigo-cell">
                                                    <Barcode size={16} />
                                                    {producto.codigoBarras}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="producto-cell">
                                                    <strong>{producto.nombreProducto}</strong>
                                                    {producto.descripcion && (
                                                        <small>{producto.descripcion}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-success">
                                                    {producto.nombreCategoria}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="precio-cell">
                                                    <DollarSign size={14} />
                                                    {parseFloat(producto.precioCompra).toFixed(2)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="precio-cell">
                                                    <DollarSign size={14} />
                                                    {parseFloat(producto.precioVenta).toFixed(2)}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${producto.stock === 0 ? 'badge-danger' :
                                                        producto.stock <= producto.stockMinimo ? 'badge-warning' :
                                                            'badge-success'
                                                    }`}>
                                                    {producto.stock} {producto.unidadMedida}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <motion.button
                                                        className="btn-icon btn-edit"
                                                        onClick={() => handleEdit(producto)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        className="btn-icon btn-delete"
                                                        onClick={() => handleDelete(producto.idProducto)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            className="modal-content card"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>{productoEdit ? 'editar producto' : 'nuevo producto'}</h2>
                                <button className="btn-close" onClick={() => setModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>código de barras</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.codigoBarras}
                                            onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                                            required
                                            disabled={productoEdit !== null}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>categoría</label>
                                        <select
                                            className="input"
                                            value={formData.idCategoria}
                                            onChange={(e) => setFormData({ ...formData, idCategoria: e.target.value })}
                                            required
                                        >
                                            <option value="">seleccionar...</option>
                                            {categorias.map(cat => (
                                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                                    {cat.nombreCategoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>nombre del producto</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.nombreProducto}
                                            onChange={(e) => setFormData({ ...formData, nombreProducto: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>descripción</label>
                                        <textarea
                                            className="input"
                                            rows="2"
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>precio compra</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input"
                                            value={formData.precioCompra}
                                            onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>precio venta</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input"
                                            value={formData.precioVenta}
                                            onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>stock inicial</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>stock mínimo</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.stockMinimo}
                                            onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>unidad de medida</label>
                                        <select
                                            className="input"
                                            value={formData.unidadMedida}
                                            onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                                        >
                                            <option value="pieza">pieza</option>
                                            <option value="kg">kilogramo</option>
                                            <option value="litro">litro</option>
                                            <option value="caja">caja</option>
                                            <option value="paquete">paquete</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {productoEdit ? 'actualizar' : 'crear'} producto
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Productos
