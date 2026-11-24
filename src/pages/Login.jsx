import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import { Alert, Button, Card, Col, Form, Row, Stack } from 'react-bootstrap'
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
      return
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
      <Card as="section" className="login-card w-100 overflow-hidden border-0" aria-label="Acceso al sistema">
        <Row className="g-0 h-100">
          <Col as="aside" md={5} className="login-brand d-flex flex-column justify-content-between p-4 p-lg-5 text-white">
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
          </Col>

          <Col md={7} className="d-flex flex-column justify-content-center p-4 p-lg-5">
            <div className="mb-4">
              <span className="login-form__eyebrow text-uppercase">Bienvenido/a</span>
              <h2 className="h2 fw-bold mt-2 mb-2">Iniciar sesión</h2>
              <p className="text-secondary mb-0">Ingresá tus datos para continuar.</p>
            </div>

            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="fw-semibold">Usuario</Form.Label>
                <Form.Control
                  autoComplete="username"
                  name="username"
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Ingresá tu usuario"
                  required
                  value={username}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fw-semibold">Contraseña</Form.Label>
                <Form.Control
                  autoComplete="current-password"
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
              </Form.Group>

              {error && (
                <Alert variant="danger" className="py-2 mb-3" role="alert">
                  {error}
                </Alert>
              )}

              <Button className="login-button w-100 fw-semibold d-flex align-items-center justify-content-center gap-2" type="submit" variant="primary" size="lg">
                Ingresar
                <span aria-hidden="true">→</span>
              </Button>
            </Form>

            <p className="text-secondary text-center mt-4 mb-0">
              Si necesitás ayuda para ingresar, consultá con el administrador.
            </p>
            <div className="text-secondary text-center mt-4">
              <p className="mb-1">Usuarios de prueba:</p>
              <Stack className="small">
                <div><strong>admin</strong> - Contraseña: <strong>1234</strong></div>
                <div><strong>user1</strong> - Contraseña: <strong>1234</strong></div>
              </Stack>
            </div>

          </Col>
        </Row>
      </Card>
      <p className="text-secondary small mb-0">Kiosco Don Ramón · Sistema de gestión</p>
    </main>
  )
}