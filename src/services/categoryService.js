import categoriesData from '../data/categories.json';
import { getProductsRaw } from './productService';

// Datos en memoria: se copian del JSON al cargar el módulo.
// Si se recarga la página, vuelve todo desde cero.
let categories = categoriesData.map((c) => ({ ...c }));


//Recorre la lista buscando el id más alto y le suma 1.
//Si la lista está vacía, empieza en 1.
//Hace lo que haría un AUTO_INCREMENT de una base de datos.
const nextId = () => categories.reduce((max, c) => Math.max(max, c.id), 0) + 1;



//String(data.name ?? '').trim(): convierte a texto, evita el undefined, y saca espacios de los costados.
//throw new Error(...): corta la función y avisa qué está mal. Quien la llamó con try/catch.
//currentId: al editar, la categoría no debe contarse como repetida consigo misma. Por eso se excluye con c.id !== currentId.
//.toLowerCase(): “Bebidas” y “bebidas” distinguen mayúsculas y minúsculas, pero para la validación no importa. Se comparan en minúsculas.
//Lo que devuelve son los datos ya “limpios”: los que realmente se guardan.
function validate(data, currentId = null) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new Error('El nombre es obligatorio');
  const repetida = categories.some(
    (c) => c.id !== currentId && c.name.toLowerCase() === name.toLowerCase()
  );
  if (repetida) throw new Error('Ya existe una categoría con ese nombre');
  return { name, description: String(data.description ?? '').trim() };
}



//Devuelven copias. Si un componente modificara el resultado, no estaría tocando los datos reales y no se saltearía las validaciones.
//getCategoryById devuelve null si no existe, y usa Number(id) porque a veces el id llega como texto (por ejemplo, de un <select>).
export const getCategories = () => categories.map((c) => ({ ...c }));

export const getCategoryById = (id) => {
  const c = categories.find((x) => x.id === Number(id));
  return c ? { ...c } : null;
};


//Primero valida, después arma la categoría con su id y la agrega. [...categories, nueva] crea una lista nueva en vez de modificar la anterior.
export function createCategory(data) {
  const clean = validate(data);
  const nueva = { id: nextId(), ...clean };
  categories = [...categories, nueva];
  return { ...nueva };
}

//Primero recorre la lista buscando la categoría con ese id. Si no existe, corta con error. Después valida los datos y arma la categoría actualizada. Por último reemplaza la categoría vieja por la nueva en la lista.
export function updateCategory(id, data) {
  const current = categories.find((c) => c.id === Number(id));
  if (!current) throw new Error('La categoría no existe');
  const clean = validate(data, current.id);
  const updated = { ...current, ...clean };
  categories = categories.map((c) => (c.id === current.id ? updated : c));
  return { ...updated };
}


//Primero verifica que exista la categoría. Después verifica que no haya productos activos en esa categoría. Si todo está bien, filtra la lista para eliminarla.
export function deleteCategory(id) {
  const numId = Number(id);
  if (!categories.some((c) => c.id === numId)) throw new Error('La categoría no existe');
  if (getProductsRaw().some((p) => p.active && p.categoryId === numId)) {
    throw new Error('No se puede eliminar: hay productos en esta categoría');
  }
  categories = categories.filter((c) => c.id !== numId);
}

// Para mostrar la cantidad de productos en la tabla.
export const countProductsByCategory = (id) =>
  getProductsRaw().filter((p) => p.active && p.categoryId === Number(id)).length;
