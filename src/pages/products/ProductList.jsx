import { useState } from 'react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import Modal from '../../components/common/InventoryModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StockBadge from '../../components/common/products/StockBadge';
import ProductForm from './ProductForm';
import ProductImage from '../../components/common/products/ProductImage';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from '../../services/productService';
import { getCategories, getCategoryById } from '../../services/categoryService';
import { getProviderById } from '../../services/providerService';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/productList.css';
import { Package } from 'lucide-react';
import { TitleCard } from '../../components/common/TitleCard';



const money = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export default function ProductList() {
  // Los datos viven en el service (memoria). Este estado solo fuerza un nuevo render
  // después de cada alta, edición o baja, y la lista se vuelve a pedir al service.
  const [, setVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editing, setEditing] = useState(null); // null | 'new' | producto
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(null);

  const categories = getCategories();

  const products = getProducts({ search, categoryId, onlyLowStock });
  const lowStock = getLowStockProducts();

  const refresh = () => setVersion((v) => v + 1);

  const handleSave = (values) => {
    if (editing === 'new') createProduct(values);
    else updateProduct(editing.id, values);
    refresh();
    setEditing(null);
    setNotice({ tone: 'ok', text: 'Producto guardado correctamente' });
  };

  const handleDelete = () => {
    try {
      deleteProduct(toDelete.id);
      refresh();
      setNotice({ tone: 'ok', text: 'Producto eliminado' });
    } catch (err) {
      setNotice({ tone: 'danger', text: err.message });
    }
    setToDelete(null);
  };

  return (
  <section className="product-list">

    <TitleCard 
      title="Productos" 
      subtitle="Catálogo, stock y reposición" 
      icon={Package} 
      textButton="+ Nuevo producto" 
      funcButton={() => setEditing('new')} 
    />

    {lowStock.length > 0 && (
      <div className="inventory-notice inventory-notice--warning">
        <strong>
          Hay {lowStock.length} producto{lowStock.length === 1 ? '' : 's'} para reponer:{' '}
        </strong>
        {lowStock.map((p) => `${p.name} (${p.stock})`).join(', ')}
      </div>
    )}

    {notice && (
      <div
        className={`inventory-notice inventory-notice--${notice.tone} inventory-notice--clickable`}
        onClick={() => setNotice(null)}
      >
        {notice.text}
      </div>
    )}

    <div className="row g-2 align-items-center mb-3">
      <div className="col-12 col-md">
        <Form.Control
          type="search"
          placeholder="Buscar producto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-auto">
        <Form.Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Form.Select>
      </div>
      <div className="col-12 col-md-auto">
        <Form.Check
          type="checkbox"
          label="Solo stock bajo"
          checked={onlyLowStock}
          onChange={(e) => setOnlyLowStock(e.target.checked)}
        />
      </div>
    </div>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-secondary">
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Stock</th>
                <th>Estado</th>
                <th className="text-end pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-list__product">
                      <ProductImage product={p} />
                      <div className="product-list__product-text">
                        <strong>{p.name}</strong>
                        {p.description && <small>{p.description}</small>}
                      </div>
                    </div>
                  </td>
                  <td>{getCategoryById(p.categoryId)?.name ?? '—'}</td>
                  <td>{getProviderById(p.providerId)?.name ?? '—'}</td>
                  <td className="text-end">{money(p.price)}</td>
                  <td className="text-end">
                    {p.stock} <small className="product-list__min-stock">/ mín. {p.minStock}</small>
                  </td>
                  <td><StockBadge product={p} /></td>
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
              {!products.length && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">No se encontraron productos</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {editing && (
        <Modal title={editing === 'new' ? 'Nuevo producto' : 'Editar producto'} onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing === 'new' ? undefined : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Estas seguro de eliminar el producto: "${toDelete.name}"? Dejará de aparecer en el catálogo.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
      
    </section>

  );
  
}
