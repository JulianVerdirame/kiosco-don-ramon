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

  const handleSubmit = (event) => {
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
    <main className="login-page container-fluid d-flex min-vh-100 flex-column align-items-center justify-content-center gap-4 px-3 py-4">
      <section className="login-card card w-100 overflow-hidden border-0" aria-label="Acceso al sistema">
        <div className="row g-0 h-100">
          <aside className="login-brand col-md-5 d-flex flex-column justify-content-between p-4 p-lg-5 text-white">
            <div className="login-brand__identity d-flex align-items-center gap-3">
              <Store className="login-brand__icon flex-shrink-0" aria-hidden="true" />
              <span>
                Kiosco
                <strong>Don Ramón</strong>
              </span>
            </div>
            <div className="login-brand__message">
              <span className="login-brand__eyebrow text-uppercase">Gestión del comercio</span>
              <h1>Todo tu kiosco, en un solo lugar.</h1>
              <p>Ingresá para administrar tu espacio de trabajo.</p>
            </div>
            <span className="login-brand__footer">Simple, claro y cerca tuyo.</span>
          </aside>

          <div className="col-md-7 d-flex flex-column justify-content-center p-4 p-lg-5">
            <div className="mb-4">
              <span className="login-form__eyebrow text-uppercase">Bienvenido/a</span>
              <h2 className="h2 fw-bold mt-2 mb-2">Iniciar sesión</h2>
              <p className="text-secondary mb-0">Ingresá tus datos para continuar.</p>
            </div>

            <form className="login-form d-grid gap-2" onSubmit={handleSubmit}>
              <label className="form-label fw-semibold mb-0" htmlFor="username">Usuario</label>
              <input
                autoComplete="username"
                className="form-control mb-2"
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

              <label className="form-label fw-semibold mb-0" htmlFor="password">Contraseña</label>
              <input
                autoComplete="current-password"
                className="form-control mb-2"
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
                <p className="alert alert-danger py-2 mb-2" role="alert">
                  {error}
                </p>
              )}

              <button className="btn btn-primary btn-lg login-button fw-semibold d-flex align-items-center justify-content-center gap-2" type="submit">
                Ingresar
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="text-secondary text-center mt-4 mb-0">
              Si necesitás ayuda para ingresar, consultá con el administrador.
            </p>
            <p className="text-secondary text-center mt-4 mb-0"> Usuarios de prueba: </p>
            <p className="text-secondary text-center mb-0">
              <strong>admin</strong> / Contraseña: <strong>1234</strong>
              <strong>user1</strong> / Contraseña: <strong>1234</strong>
            </p>

          </div>
        </div>
      </section>
      <p className="text-secondary small mb-0">Kiosco Don Ramón · Sistema de gestión</p>
    </main>
  )
}