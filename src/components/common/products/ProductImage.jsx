/**
 * ProductImage.jsx
 *
 * Qué es:     Miniatura cuadrada con la imagen de un producto.
 * Qué hace:   Muestra la imagen guardada en public/img cuyo nombre está en
 *             product.image. Si el producto no tiene imagen, o el archivo no existe,
 *             muestra un cuadro con la primera letra del nombre.
 * Props:
 *   - product: objeto producto, con al menos `name` e `image` (opcional).
 * Depende de: inventory.css (colores) y ProductImage.css.
 * Lo usan:    ProductList. Está pensado para reutilizarse en el punto de venta.
 */
import { useState } from 'react';
import '../../../styles/inventory/inventory.css';
import '../../../styles/inventory/ProductImage.css';

// Props: product (obligatoria) y size ('normal' por defecto, o 'large' para tarjetas).
export default function ProductImage({ product, size = 'normal' }) {
  const [failedImage, setFailedImage] = useState('');
  const { image, name } = product;
  // Si el tamaño es 'large' se agrega una clase extra; si no, queda vacía.
  const sizeClass = size === 'large' ? ' product-image--large' : '';

  if (image && failedImage !== image) {
    return (
      <img
        className={`product-image${sizeClass}`}
        src={`${import.meta.env.BASE_URL}img/${image}`}
        alt=""
        loading="lazy"
        onError={() => setFailedImage(image)}
      />
    );
  }

  return (
    <span className={`product-image product-image--empty${sizeClass}`} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}