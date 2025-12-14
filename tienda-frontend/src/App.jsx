import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Clientes from './pages/Clientes'
import Reportes from './pages/Reportes'
import Layout from './components/Layout'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // verificar si hay sesion activa
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            setIsAuthenticated(true)
            setUser(JSON.parse(userData))
        }
    }, [])

    const handleLogin = (userData, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" /> :
                            <Login onLogin={handleLogin} />
                    }
                />

                <Route
                    path="/"
                    element={
                        isAuthenticated ?
                            <Layout user={user} onLogout={handleLogout} /> :
                            <Navigate to="/login" />
                    }
                >
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard user={user} />} />
                    <Route path="productos" element={<Productos user={user} />} />
                    <Route path="ventas" element={<Ventas user={user} />} />
                    <Route path="clientes" element={<Clientes user={user} />} />
                    <Route path="reportes" element={<Reportes user={user} />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App
