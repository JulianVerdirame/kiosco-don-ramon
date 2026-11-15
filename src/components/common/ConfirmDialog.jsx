import Modal from './Modal';
import '../../styles/inventory/inventory.css';
import '../../styles/inventory/ConfirmDialog.css';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="confirm-dialog__actions">
        <button type="button" className="inventory-button" onClick={onCancel}>
          No
        </button>
        <button type="button" className="inventory-button inventory-button--danger" onClick={onConfirm}>
          Sí
        </button>
      </div>
    </Modal>
  );
}
