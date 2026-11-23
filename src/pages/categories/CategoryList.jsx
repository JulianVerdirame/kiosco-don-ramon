import { useState } from 'react';
import Modal from '../../components/common/InventoryModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CategoryForm from './CategoryForm';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  countProductsByCategory,
} from '../../services/categoryService';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/CategoryList.css';


export default function CategoryList() {
  const [categories, setCategories] = useState(getCategories);
  const [editing, setEditing] = useState(null); // null | 'new' | categoría
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(null);

  const refresh = () => setCategories(getCategories());

  const handleSave = (values) => {
    // Si el service lanza un error, lo captura el formulario y lo muestra.
    if (editing === 'new') createCategory(values);
    else updateCategory(editing.id, values);
    refresh();
    setEditing(null);
    setNotice({ tone: 'ok', text: 'Categoría guardada correctamente' });
  };

  const handleDelete = () => {
    try {
      deleteCategory(toDelete.id);
      refresh();
      setNotice({ tone: 'ok', text: 'Categoría eliminada' });
    } catch (err) {
      setNotice({ tone: 'danger', text: err.message });
    }
    setToDelete(null);
  };

  return (
    <section className="category-list">
      <div className="category-list__header">
        <div>
          <h1 className="category-list__title">Categorías</h1>
          <p className="category-list__subtitle">Organizá los productos para encontrarlos más rápido</p>
        </div>
        <button className="inventory-button inventory-button--accent" onClick={() => setEditing('new')}>+ Nueva categoría</button>
      </div>

      {notice && (
        <div className={`inventory-notice inventory-notice--${notice.tone}`} onClick={() => setNotice(null)}>{notice.text}</div>
      )}

      <div className="category-list__table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="inventory-table__cell--number">Productos</th>
              <th className="inventory-table__cell--actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.description || '—'}</td>
                <td className="inventory-table__cell--number">{countProductsByCategory(c.id)}</td>
                <td className="inventory-table__cell--actions">
                  <div className="category-list__actions">
                    <button
                    className="inventory-button inventory-button--small inventory-button--success"
                    onClick={() => setEditing(c)}>
                    Editar
                    </button>
                    <button className="inventory-button inventory-button--small inventory-button--danger" onClick={() => setToDelete(c)}>
                      Eliminar
                    </button>
                    </div>
                </td>
              </tr>
            ))}
            {!categories.length && (
              <tr><td colSpan={4} className="inventory-table__empty">No hay categorías cargadas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Nueva categoría' : 'Editar categoría'} onClose={() => setEditing(null)}>
          <CategoryForm
            initial={editing === 'new' ? undefined : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar categoría"
          message={`¿Estas seguro de eliminar está categoría: "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
