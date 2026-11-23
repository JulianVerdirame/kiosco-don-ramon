import { useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
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
import { TitleCard } from '../../components/common/TitleCard';
import { Tag } from 'lucide-react';


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
      
      <TitleCard 
        title="Categorías" 
        subtitle="Organizá los productos para encontrarlos más rápido" 
        icon={Tag} 
        textButton="+ Nueva categoría" 
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
                <th>Descripción</th>
                <th className="text-end">Productos</th>
                <th className="text-end pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.description || '—'}</td>
                  <td className="text-end">{countProductsByCategory(c.id)}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="outline-success" size="sm" onClick={() => setEditing(c)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => setToDelete(c)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!categories.length && (
                <tr><td colSpan={4} className="text-center text-muted py-5">No hay categorías cargadas</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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
