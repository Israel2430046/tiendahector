import axios from 'axios'

const API_URL = 'http://localhost/Tienda/backend/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// autenticacion
export const login = async (email, password) => {
    const response = await api.post('/auth.php', {
        action: 'login',
        email,
        password
    })
    return response.data
}

export const register = async (nombre, email, password, idRol = 2) => {
    const response = await api.post('/auth.php', {
        action: 'register',
        nombre,
        email,
        password,
        idRol
    })
    return response.data
}

// productos
export const getProductos = async (categoria = null, busqueda = null) => {
    let url = '/productos.php'
    const params = new URLSearchParams()

    if (categoria) params.append('categoria', categoria)
    if (busqueda) params.append('busqueda', busqueda)

    if (params.toString()) url += `?${params.toString()}`

    const response = await api.get(url)
    return response.data
}

export const getProductoById = async (id) => {
    const response = await api.get(`/productos.php?id=${id}`)
    return response.data
}

export const createProducto = async (producto) => {
    const response = await api.post('/productos.php', producto)
    return response.data
}

export const updateProducto = async (producto) => {
    const response = await api.put('/productos.php', producto)
    return response.data
}

export const deleteProducto = async (id) => {
    const response = await api.delete(`/productos.php?id=${id}`)
    return response.data
}

export const getProductosLowStock = async () => {
    const response = await api.get('/productos.php?lowStock=1')
    return response.data
}

// categorias
export const getCategorias = async () => {
    const response = await api.get('/categorias.php')
    return response.data
}

// ventas
export const getVentas = async (fechaInicio = null, fechaFin = null) => {
    let url = '/ventas.php'
    if (fechaInicio && fechaFin) {
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    }
    const response = await api.get(url)
    return response.data
}

export const createVenta = async (venta) => {
    const response = await api.post('/ventas.php', venta)
    return response.data
}

export const getDetalleVenta = async (idVenta) => {
    const response = await api.get(`/ventas.php?detalle=${idVenta}`)
    return response.data
}

export const getEstadisticasVentas = async () => {
    const response = await api.get('/ventas.php?estadisticas=1')
    return response.data
}

// clientes
export const getClientes = async () => {
    const response = await api.get('/clientes.php')
    return response.data
}

export const createCliente = async (cliente) => {
    const response = await api.post('/clientes.php', cliente)
    return response.data
}

export default api
