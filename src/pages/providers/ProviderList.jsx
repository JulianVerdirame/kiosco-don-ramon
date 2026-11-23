import { useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import Modal from '../../components/common/InventoryModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProviderForm from './ProviderForm';
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  countProductsByProvider,
} from '../../services/providerService';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/providerList.css';
import { TitleCard } from '../../components/common/TitleCard';
import { Truck } from 'lucide-react';

export default function ProviderList() {
  const [providers, setProviders] = useState(getProviders);
  const [editing, setEditing] = useState(null); // null | 'new' | proveedor
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(null);

  const refresh = () => setProviders(getProviders());

  const handleSave = (values) => {
    if (editing === 'new') createProvider(values);
    else updateProvider(editing.id, values);
    refresh();
    setEditing(null);
    setNotice({ tone: 'ok', text: 'Proveedor guardado correctamente' });
  };

  const handleDelete = () => {
    try {
      deleteProvider(toDelete.id);
      refresh();
      setNotice({ tone: 'ok', text: 'Proveedor eliminado' });
    } catch (err) {
      setNotice({ tone: 'danger', text: err.message });
    }
    setToDelete(null);
  };

  return (
    <section className="provider-list">

      <TitleCard
        title="Proveedores"
        subtitle="Contactos de quienes abastecen el kiosco"
        icon={Truck}
        textButton="+ Nuevo proveedor"
        funcButton={() => setEditing('new')}
      />

      {notice && (
        <div className={`inventory-notice inventory-notice--${notice.tone}`} onClick={() => setNotice(null)}>{notice.text}</div>
      )}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-secondary">
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th className="text-end">Productos</th>
                <th className="text-end pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                  <td className="text-end">{countProductsByProvider(p.id)}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="outline-success" size="sm" onClick={() => setEditing(p)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => setToDelete(p)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!providers.length && (
                <tr><td colSpan={5} className="text-center text-muted py-5">No hay proveedores cargados</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {editing && (
        <Modal title={editing === 'new' ? 'Nuevo proveedor' : 'Editar proveedor'} onClose={() => setEditing(null)}>
          <ProviderForm
            initial={editing === 'new' ? undefined : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar proveedor"
          message={`¿Estas seguro de eliminar al proveedor "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
