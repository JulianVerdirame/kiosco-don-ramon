import productsData from '../data/products.json';
import { getCategoryById } from './categoryService';
import { getProviderById } from './providerService';

// Datos en memoria (se pierden al recargar la página).
//importa funciones de categorías y proveedores, para comprobar que existan al guardar un producto.
let products = productsData.map((p) => ({ ...p }));

const nextId = () => products.reduce((max, p) => Math.max(max, p.id), 0) + 1;

// Uso interno de los otros services (para contar productos por categoría y proveedor).
export const getProductsRaw = () => products;

//Es una sola función que decide el estado, y se muestra en la tabla, el aviso de reposición, el filtro y el Dashboard. 
export function getStockStatus(product) {
  if (product.stock <= 0) return 'sin-stock';
  if (product.stock <= product.minStock) return 'bajo';
  return 'normal';
}

//¿Por qué Number(...)? Lo que escribe el usuario en un <input> siempre llega como texto ("100", no 100). Hay que convertirlo para poder comparar y hacer cuentas. Lo mismo para los <select> de categoría y proveedor.
function validate(data, categoryExists, providerExists) {
  const name = String(data.name ?? '').trim();
  const price = Number(data.price);
  const stock = Number(data.stock);
  const minStock = Number(data.minStock);
  const categoryId = Number(data.categoryId);
  const providerId = Number(data.providerId);

  //Number('') da 0, así que un precio vacío pasaría como si fuera 0. Por eso se comprueba aparte data.price === ''.
  //Number.isFinite(price) rechaza NaN (por ejemplo, "abc") y los infinitos.
  //price < 0 rechaza negativos.
  if (!name) throw new Error('El nombre es obligatorio');
  if (data.price === '' || data.price == null || !Number.isFinite(price) || price < 0)
    throw new Error('El precio debe ser un número mayor o igual a 0');
  if (!Number.isInteger(stock) || stock < 0) throw new Error('El stock debe ser un entero mayor o igual a 0');
  if (!Number.isInteger(minStock) || minStock < 0) //Valida si los numeros ingresados sonenteros, si el stock minimo es igual o mayor a 0 y en caso de que se ingrese uno negativo, tira error.
    throw new Error('El stock mínimo debe ser un entero mayor o igual a 0');
  if (!categoryExists(categoryId)) throw new Error('Elegí una categoría válida');
  if (!providerExists(providerId)) throw new Error('Elegí un proveedor válido');

  return {
    name,
    description: String(data.description ?? '').trim(),
    price,
    stock,
    minStock,
    categoryId,
    providerId,
  };
}

// category/providerService también importan este archivo (import circular), pero
// no hay problema: solo se usan dentro de funciones, nunca al cargar el módulo.
const categoryExists = (id) => getCategoryById(id) !== null;
const providerExists = (id) => getProviderById(id) !== null;

/**
 * Devuelve los productos activos.
 * filters: { search?: string, categoryId?: number|string, providerId?: number|string, onlyLowStock?: boolean }
 */
export function getProducts(filters = {}) {
  const { search = '', categoryId, providerId, onlyLowStock = false } = filters;
  const q = search.trim().toLowerCase();
  return products
    .filter((p) => p.active)
    .filter((p) => !q || p.name.toLowerCase().includes(q))
    .filter((p) => !categoryId || p.categoryId === Number(categoryId))
    .filter((p) => !providerId || p.providerId === Number(providerId))
    .filter((p) => !onlyLowStock || getStockStatus(p) !== 'normal')
    .map((p) => ({ ...p }));
}

export const getProductById = (id) => {
  const p = products.find((x) => x.id === Number(id) && x.active);
  return p ? { ...p } : null;
};

/** Productos activos con stock <= stock mínimo (incluye los sin stock). Útil para el Dashboard. */
export const getLowStockProducts = () => getProducts({ onlyLowStock: true });

export function createProduct(data) {
  const clean = validate(data, categoryExists, providerExists);
  const nuevo = { id: nextId(), ...clean, active: true };
  products = [...products, nuevo];
  return { ...nuevo };
}

export function updateProduct(id, data) {
  const current = products.find((p) => p.id === Number(id) && p.active);
  if (!current) throw new Error('El producto no existe');
  const clean = validate(data, categoryExists, providerExists);
  const updated = { ...current, ...clean };
  products = products.map((p) => (p.id === current.id ? updated : p));
  return { ...updated };
}

/** Baja lógica: el producto queda con active=false para no romper el historial de ventas. */
export function deleteProduct(id) {
  const current = products.find((p) => p.id === Number(id) && p.active);
  if (!current) throw new Error('El producto no existe');
  products = products.map((p) => (p.id === current.id ? { ...p, active: false } : p));
}

/**
 * Descuenta stock (lo usa el punto de venta al confirmar una venta).
 * Lanza un error si el producto no existe o no alcanza el stock.
 */
export function decreaseStock(id, quantity) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty <= 0) throw new Error('La cantidad debe ser un entero mayor a 0');
  const current = products.find((p) => p.id === Number(id) && p.active);
  if (!current) throw new Error('El producto no existe');
  if (current.stock < qty)
    throw new Error(`Stock insuficiente de "${current.name}" (disponible: ${current.stock})`);
  products = products.map((p) => (p.id === current.id ? { ...p, stock: p.stock - qty } : p));
  return current.stock - qty;
}
