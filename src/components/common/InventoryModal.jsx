/**
 * Modal.jsx
 *
 * Qué es:     Ventana flotante reutilizable, hecha con el elemento nativo <dialog>.
 * Qué hace:   El navegador dibuja el fondo oscuro, centra el cuadro y cierra con
 *             Escape. Acá solo se abre al montarse y se avisa a quien la usó (onClose).
 * Props:      title, onClose, children (igual que antes).
 * Depende de: Modal.css.
 * Lo usan:    CategoryList, ProviderList, ProductList y ConfirmDialog.
 */
import { useEffect, useRef } from 'react';
import '../../styles/inventory/Modal.css';


export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null); // referencia al elemento <dialog>

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal(); // lo abre como ventana modal
    return () => dialog.close();          // lo cierra al desmontarse
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="app-modal"
      // Escape dispara "cancel": se evita el cierre automático y se avisa a la pantalla,
      // que es quien decide (así el estado de React queda siempre sincronizado).
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      // Un clic en el fondo oscuro llega al <dialog> mismo; uno dentro del cuadro llega a un hijo.
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="app-modal__head">
        <h3 className="app-modal__title">{title}</h3>
                <button type="button" className="app-modal__close" onClick={onClose} aria-label="Cerrar">&times;</button>
      </div>
      <div className="app-modal__body">{children}</div>
    </dialog>
  );
}