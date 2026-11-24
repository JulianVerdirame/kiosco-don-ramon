import { Modal as BootstrapModal } from 'react-bootstrap';

export default function Modal({ title, onClose, children, footer }) {
  return (
    <BootstrapModal show onHide={onClose} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
      {footer && <BootstrapModal.Footer>{footer}</BootstrapModal.Footer>}
    </BootstrapModal>
  );
}
