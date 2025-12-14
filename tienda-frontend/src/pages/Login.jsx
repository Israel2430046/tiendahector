import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { login } from '../services/api'
import './Login.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await login(email, password)

            if (response.success) {
                onLogin(response.data.user, response.data.token)
            } else {
                setError(response.message || 'credenciales incorrectas')
            }
        } catch (err) {
            setError('error al conectar con el servidor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            {/* particulas animadas de fondo */}
            <div className="particles">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        animate={{
                            y: [0, -1000],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="login-card glass"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
            >
                {/* logo animado */}
                <motion.div
                    className="login-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <motion.div
                        className="logo-circle"
                        animate={{
                            rotate: 360,
                            boxShadow: [
                                '0 0 20px rgba(99, 102, 241, 0.5)',
                                '0 0 40px rgba(236, 72, 153, 0.5)',
                                '0 0 20px rgba(99, 102, 241, 0.5)'
                            ]
                        }}
                        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
                    >
                        <ShoppingCart size={48} color="white" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    className="login-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Tienda de Abarrotes
                </motion.h1>

                <motion.p
                    className="login-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    sistema de gestión integral
                </motion.p>

                <form onSubmit={handleSubmit} className="login-form">
                    <motion.div
                        className="input-group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="input-icon">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            className="input"
                            placeholder="correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="input-group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="input-icon">
                            <Lock size={20} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="input"
                            placeholder="contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </motion.div>

                    {error && (
                        <motion.div
                            className="error-message"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                        ) : (
                            'iniciar sesión'
                        )}
                    </motion.button>
                </form>

                <motion.div
                    className="login-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p className="demo-credentials">
                        <strong>credenciales de prueba:</strong><br />
                        email: admin@tienda.com<br />
                        password: admin123
                    </p>
                </motion.div>
            </motion.div>

            {/* ondas animadas en el fondo */}
            <div className="waves">
                <motion.div
                    className="wave wave1"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
                <motion.div
                    className="wave wave2"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </div>
        </div>
    )
}

export default Login
