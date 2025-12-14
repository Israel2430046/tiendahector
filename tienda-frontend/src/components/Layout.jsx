import { Outlet, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'
import './Layout.css'

function Layout({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'dashboard' },
        { path: '/productos', icon: Package, label: 'productos' },
        { path: '/ventas', icon: ShoppingCart, label: 'ventas' },
        { path: '/clientes', icon: Users, label: 'clientes' },
        { path: '/reportes', icon: BarChart3, label: 'reportes' }
    ]

    return (
        <div className="layout">
            {/* sidebar */}
            <motion.aside
                className={`sidebar glass-dark ${sidebarOpen ? 'open' : 'closed'}`}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <div className="sidebar-header">
                    <motion.div
                        className="sidebar-logo"
                        whileHover={{ scale: 1.05 }}
                    >
                        <ShoppingCart size={32} color="white" />
                        {sidebarOpen && <span>mi tienda</span>}
                    </motion.div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <motion.div
                                className="nav-item-content"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ x: 5 }}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </motion.div>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <motion.button
                        className="logout-btn"
                        onClick={onLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>cerrar sesión</span>}
                    </motion.button>
                </div>
            </motion.aside>

            {/* contenido principal */}
            <div className="main-content">
                {/* header */}
                <motion.header
                    className="header glass"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    <button
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="header-user">
                        <div className="user-info">
                            <span className="user-name">{user?.nombre}</span>
                            <span className="user-role">{user?.rol}</span>
                        </div>
                        <motion.div
                            className="user-avatar"
                            whileHover={{ scale: 1.1 }}
                        >
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </motion.div>
                    </div>
                </motion.header>

                {/* contenido de las paginas */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
