import { useState } from 'react';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/CategoryForm.css';


export default function CategoryForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState({ name: '', description: '', ...initial });
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
  <form className="category-form" onSubmit={handleSubmit} noValidate>
    <label className="inventory-field">
      <span className="inventory-field__label">Nombre</span>
      <input
        className="inventory-field__control"
        value={values.name}
        onChange={set('name')}
        autoFocus
      />
    </label>

    <label className="inventory-field">
      <span className="inventory-field__label">Descripción</span>
      <textarea
        className="inventory-field__control"
        rows={3}
        value={values.description}
        onChange={set('description')}
      />
    </label>

    {error && <div className="inventory-notice inventory-notice--danger">{error}</div>}

    <div className="category-form__actions">
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
