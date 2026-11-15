import { useState } from 'react';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/providerForm.css';


export default function ProviderForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', ...initial });
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
  <form className="provider-form" onSubmit={handleSubmit} noValidate>
    <label className="inventory-field">
      <span className="inventory-field__label">Nombre / empresa</span>
      <input
        className="inventory-field__control"
        value={values.name}
        onChange={set('name')}
        autoFocus
      />
    </label>

    <label className="inventory-field">
      <span className="inventory-field__label">Teléfono</span>
      <input
        className="inventory-field__control"
        value={values.phone}
        onChange={set('phone')}
        inputMode="tel"
      />
    </label>

    <label className="inventory-field">
      <span className="inventory-field__label">Email</span>
      <input
        className="inventory-field__control"
        type="email"
        value={values.email}
        onChange={set('email')}
      />
    </label>

    {error && <div className="inventory-notice inventory-notice--danger">{error}</div>}

    <div className="provider-form__actions">
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
