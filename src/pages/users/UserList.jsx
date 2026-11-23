import { useState } from 'react';
import { Alert, Badge, Button, Card, Modal, Table } from 'react-bootstrap';
import { Users } from 'lucide-react';
import UserForm from './UserForm';
import { TitleCard } from '../../components/common/TitleCard';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../../services/userService';

export const UserList = () => {
  const [users, setUsers] = useState(getUsers);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(null);

  const refresh = () => setUsers(getUsers());

  const handleSave = (values) => {
    if (editing === 'new') createUser(values);
    else updateUser(editing.id, values);
    refresh();
    setEditing(null);
    setNotice({ variant: 'success', text: 'Usuario guardado correctamente' });
  };

  const handleDelete = () => {
    try {
      deleteUser(toDelete.id);
      refresh();
      setNotice({ variant: 'success', text: 'Usuario desactivado correctamente' });
    } catch (err) {
      setNotice({ variant: 'danger', text: err.message });
    }
    setToDelete(null);
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <TitleCard
        title="Usuarios"
        subtitle="Administrá las cuentas y los permisos del sistema"
        icon={Users}
        textButton="+ Nuevo usuario"
        funcButton={() => setEditing('new')}
      />

      {notice && (
        <Alert
          variant={notice.variant}
          dismissible
          onClose={() => setNotice(null)}
          className="mb-3"
        >
          {notice.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-secondary">
                <tr>
                  <th className="ps-3">Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-end pe-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="ps-3">
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Empleado'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.active ? 'success' : 'secondary'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => setEditing(user)}
                        >
                          Editar
                        </Button>
                        {user.active && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setToDelete(user)}
                          >
                            Desactivar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-5">
                      No hay usuarios cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
        </Card.Body>
      </Card>

      <Modal
        show={editing !== null}
        onHide={() => setEditing(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editing === 'new' ? 'Nuevo usuario' : 'Editar usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <UserForm
              initial={editing === 'new' ? undefined : editing}
              onSubmit={handleSave}
              onCancel={() => setEditing(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={toDelete !== null}
        onHide={() => setToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Desactivar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de desactivar al usuario <strong>{toDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setToDelete(null)}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sí
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
