import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

export default function UserForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    username: '',
    password: '',
    name: '',
    role: 'empleado',
    active: true,
    ...initial,
  });
  const [error, setError] = useState('');

  const set = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      onSubmit(values);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="userName">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control
          value={values.name}
          onChange={set('name')}
          placeholder="Ej: Juan Pérez"
          autoFocus
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control
          value={values.username}
          onChange={set('username')}
          placeholder="Ej: jperez"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={values.password ?? ''}
          onChange={set('password')}
          placeholder={initial ? 'Dejar en blanco para conservar la contraseña' : ''}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="role">
        <Form.Label>Rol</Form.Label>
        <Form.Select value={values.role} onChange={set('role')}>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </Form.Select>
      </Form.Group>

      {initial && (
        <Form.Check
          className="mb-3"
          type="switch"
          id="user-active"
          label="Cuenta activa"
          checked={values.active}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              active: event.target.checked,
            }))
          }
        />
      )}

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </div>
    </Form>
  );
}
