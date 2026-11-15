import { useState } from 'react';
import Modal from '../../components/common/Modal';
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
      <header className="provider-list__header">
  <div>
    <h1 className="provider-list__title">Proveedores</h1>
    <p className="provider-list__subtitle">Contactos de quienes abastecen el kiosco</p>
  </div>
  <button className="inventory-button inventory-button--accent" onClick={() => setEditing('new')}>
    + Nuevo proveedor
  </button>
</header>

      {notice && (
        <div className={`inventory-notice inventory-notice--${notice.tone}`} onClick={() => setNotice(null)}>{notice.text}</div>
      )}

      <div className="provider-list__table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th className="inventory-table__cell--number">Productos</th>
              <th className="inventory-table__cell--actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td className="inventory-table__cell--number">{countProductsByProvider(p.id)}</td>
                <td className="inventory-table__cell--actions">
                <div className="provider-list__actions">
              <button className="inventory-button inventory-button--small inventory-button--success"
                onClick={() => setEditing(p)}>
                Editar
              </button>
              <button className="inventory-button inventory-button--small inventory-button--danger"
              onClick={() => setToDelete(p)}>
               Eliminar
              </button>
              </div>
            </td>
          </tr>
            ))}
            {!providers.length && (
              <tr><td colSpan={5} className="inventory-table__empty">No hay proveedores cargados</td></tr>
            )}
          </tbody>
        </table>
      </div>

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
