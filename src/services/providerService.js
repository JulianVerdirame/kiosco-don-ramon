import providersData from '../data/providers.json';
import { getProductsRaw } from './productService';


let providers = providersData.map((p) => ({ ...p }));

const nextId = () => providers.reduce((max, p) => Math.max(max, p.id), 0) + 1;

function validate(data, currentId = null) {
  //Se limpian los tres. Solo el email se pasa a minúsculas, porque es el que se va a comparar para detectar repetidos.
  const name = String(data.name ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  const email = String(data.email ?? '').trim().toLowerCase();
  if (!name) throw new Error('El nombre es obligatorio');
  if (!phone) throw new Error('El teléfono es obligatorio');
  //Los ^ y $ indican que toda la cadena debe cumplir la condición, no solo una parte.
  if (!/^[0-9+\-\s]{6,20}$/.test(phone)) throw new Error('El teléfono solo puede tener números, espacios, + o -');
  if (!email) throw new Error('El email es obligatorio');
  //El patrón es muy simple, solo verifica que haya un @ y un punto. No es perfecto, pero sirve para detectar errores obvios.
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('El email no es válido');
  if (providers.some((p) => p.id !== currentId && p.email.toLowerCase() === email)) {
    throw new Error('Ya existe un proveedor con ese email');
  }
  return { name, phone, email };
}


//Devuelven copias. Si un componente modificara el resultado, no estaría tocando los datos reales y no se saltearía las validaciones.
//getProviderById devuelve null si no existe, y usa Number(id) porque a veces el id llega como texto (por ejemplo, de un <select>).
export const getProviders = () => providers.map((p) => ({ ...p }));

export const getProviderById = (id) => {
  const p = providers.find((x) => x.id === Number(id));
  return p ? { ...p } : null;
};



//Primero valida, después arma la categoría con su id y la agrega. [...proveedores, nuevo] crea una lista nueva en vez de modificar la anterior.
export function createProvider(data) {
  const clean = validate(data);
  const nuevo = { id: nextId(), ...clean };
  providers = [...providers, nuevo];
  return { ...nuevo };
}


//Primero recorre la lista buscando el proveedor con ese id. Si no existe, corta con error. Después valida los datos y arma el proveedor actualizado. Por último reemplaza la categoría vieja por la nueva en la lista.
export function updateProvider(id, data) {
  const current = providers.find((p) => p.id === Number(id));
  if (!current) throw new Error('El proveedor no existe');
  const clean = validate(data, current.id);
  const updated = { ...current, ...clean };
  providers = providers.map((p) => (p.id === current.id ? updated : p));
  return { ...updated };
}


//Primero verifica que exista el proveedor. Después verifica que no haya productos activos asociados con él. Si todo está bien, filtra la lista para eliminarlo.
export function deleteProvider(id) {
  const numId = Number(id);
  if (!providers.some((p) => p.id === numId)) throw new Error('El proveedor no existe');
  if (getProductsRaw().some((p) => p.active && p.providerId === numId)) {
    throw new Error('No se puede eliminar: el proveedor tiene productos asociados');
  }
  providers = providers.filter((p) => p.id !== numId);
}

// Para mostrar la cantidad de productos en la tabla.
export const countProductsByProvider = (id) =>
  getProductsRaw().filter((p) => p.active && p.providerId === Number(id)).length;
