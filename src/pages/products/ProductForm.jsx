import { useState } from 'react';
import { getCategories } from '../../services/categoryService';
import { getProviders } from '../../services/providerService';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/productForm.css';
import ProductImage from '../../components/common/products/ProductImage';


const EMPTY = {
  name: '',
  description: '',
  price: '',
  image: '',
  stock: '',
  minStock: 5,
  categoryId: '',
  providerId: '',
};

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [categories] = useState(getCategories);
  const [providers] = useState(getProviders);
  const [values, setValues] = useState({
    ...EMPTY,
    categoryId: categories[0]?.id ?? '',
    providerId: providers[0]?.id ?? '',
    ...initial,
  });
  const [error, setError] = useState('');

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(values);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <form className="product-form" onSubmit={handleSubmit} noValidate>
    <div className="product-form__grid">
      <label className="inventory-field product-form__field--full">
        <span className="inventory-field__label">Nombre</span>
        <input
          className="inventory-field__control"
          value={values.name}
          onChange={set('name')}
          autoFocus
        />
      </label>

      <label className="inventory-field product-form__field--full">
        <span className="inventory-field__label">Descripción</span>
        <textarea
          className="inventory-field__control"
          rows={2}
          value={values.description}
          onChange={set('description')}
        />
      </label>

      <label className="inventory-field">
        <span className="inventory-field__label">Precio ($)</span>
        <input
          className="inventory-field__control"
          type="number"
          min="0"
          step="any"
          value={values.price}
          onChange={set('price')}
        />
      </label>

      <label className="inventory-field">
        <span className="inventory-field__label">Stock actual</span>
        <input
          className="inventory-field__control"
          type="number"
          min="0"
          step="1"
          value={values.stock}
          onChange={set('stock')}
        />
      </label>

      <label className="inventory-field product-form__field--full">
        <span className="inventory-field__label">Stock mínimo (para la alerta de reposición)</span>
        <input
          className="inventory-field__control"
          type="number"
          min="0"
          step="1"
          value={values.minStock}
          onChange={set('minStock')}
        />
      </label>

      <label className="inventory-field">
        <span className="inventory-field__label">Categoría</span>
        <select
          className="inventory-field__control"
          value={values.categoryId}
          onChange={set('categoryId')}
        >
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      <label className="inventory-field">
        <span className="inventory-field__label">Proveedor</span>
        <select
          className="inventory-field__control"
          value={values.providerId}
          onChange={set('providerId')}
        >
          {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
    </div>

    {error && <div className="inventory-notice inventory-notice--danger">{error}</div>}

    <div className="product-form__actions">
      <button type="button" className="inventory-button" onClick={onCancel}>
        Cancelar
      </button>
      <button type="submit" className="inventory-button inventory-button--primary">
        Guardar
      </button>
    </div>
  </form>
  );
}
