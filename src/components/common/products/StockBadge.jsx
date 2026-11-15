import { getStockStatus } from '../../../services/productService';

const LABELS = {
  'sin-stock': 'Sin stock',
  bajo: 'Stock bajo',
  normal: 'Normal',
};

// Etiqueta de color según el estado del stock. Reutilizable en el punto de venta o el Dashboard.
export default function StockBadge({ product }) {
  const status = getStockStatus(product);
  return <span className={`stock-badge stock-badge---${status}`}>{LABELS[status]}</span>;
}
