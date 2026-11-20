import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Login.css'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { login, logout } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    if (!login(username.trim(), password)) {
      setError('El usuario o la contraseña no son correctos.')
    }
    
    navigate('/', { replace: true })
  }

  useEffect(() => {
    // Se cierra la sesión automaticamente si el usuario vuelve al login manipulando la url
    // Esto es para evitar que un usuario logueado pueda volver a la página de login y loguearse con otro usuario, 
    // o vueva a ingresar a otra pagina mediante URL provocando un comportamiento extraño
    logout()
  }, [])
  
  return (
    <main className="login-page">
      <section className="login-card" aria-label="Acceso al sistema">
        <aside className="login-brand">
          <div className="login-brand__identity">
            <Store size={48} />
            <span>
              Kiosco
              <strong>Don Ramón</strong>
            </span>
          </div>
          <div className="login-brand__message">
            <span className="login-brand__eyebrow">GESTIÓN DEL COMERCIO</span>
            <h1>Todo tu kiosco, en un solo lugar.</h1>
            <p>Ingresá para administrar tu espacio de trabajo.</p>
          </div>
          <span className="login-brand__footer">Simple, claro y cerca tuyo.</span>
        </aside>

        <div className="login-content">
          {
            <>
              <div className="login-heading">
                <span className="login-form__eyebrow">BIENVENIDO/A</span>
                <h2>Iniciar sesión</h2>
                <p>Ingresá tus datos para continuar.</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Usuario</label>
                <input
                  autoComplete="username"
                  id="username"
                  name="username"
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Ingresá tu usuario"
                  required
                  value={username}
                />

                <label htmlFor="password">Contraseña</label>
                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Ingresá tu contraseña"
                  required
                  type="password"
                  value={password}
                />

                {error && (
                  <p className="login-form__error" role="alert">
                    {error}
                  </p>
                )}

                <button className="login-button" type="submit">
                  Ingresar
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <p className="login-note">
                Si necesitás ayuda para ingresar, consultá con el administrador.
              </p>
            </>
          }
        </div>
      </section>
      <p className="login-copyright">Kiosco Don Ramón · Sistema de gestión</p>
    </main>
  )
}