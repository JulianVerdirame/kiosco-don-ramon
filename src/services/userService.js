import usersData from '../data/users.json';
// Datos en memoria: se copian del JSON al cargar el modulo.
let users = usersData.map((u) => ({ ...u }));

const nextId = () => users.reduce((max, u) => Math.max(max, u.id), 0) + 1;

export const getUsersRaw = () => users;

function getSafeUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function normalizeRole(role) {
  const value = String(role ?? '').trim().toLowerCase();
  if (value === 'employee') return 'empleado';
  return value;
}

function validate(data, currentId = null) {
  const username = String(data.username ?? '').trim();
  const password = String(data.password ?? '').trim();
  const name = String(data.name ?? '').trim();
  const role = normalizeRole(data.role);

  if (!username) throw new Error('El nombre de usuario es obligatorio');
  if (password === '' && currentId === null)
    throw new Error('La contraseña es obligatoria');
  if (!name) throw new Error('El nombre es obligatorio');
  if (!['admin', 'empleado'].includes(role))
    throw new Error('El rol debe ser administrador o empleado');

  const repeated = users.some(
    (u) => u.id !== currentId && u.username.toLowerCase() === username.toLowerCase(),
  );
  if (repeated) throw new Error('Ya existe un usuario con ese nombre de usuario');

  const clean = { username, name, role };
  if (password !== '' || currentId === null) clean.password = password;
  if (data.active !== undefined) {
    clean.active =
      typeof data.active === 'boolean'
        ? data.active
        : String(data.active).toLowerCase() === 'true';
  }
  return clean;
}

// Devuelven copias para que un componente no pueda modificar el estado interno.
export const getUsers = () =>
  users.map((u) => getSafeUser(u));

export const getUserById = (id) => {
  const u = users.find((x) => x.id === Number(id));
  if (!u) return null;
  return getSafeUser(u);
};

export function createUser(data) {
  const clean = validate(data);
  const nuevo = {
    id: nextId(),
    ...clean,
    active: clean.active ?? true,
  };
  users = [...users, nuevo];
  return getSafeUser(nuevo);
}

export function updateUser(id, data) {
  const current = users.find((u) => u.id === Number(id));
  if (!current) throw new Error('El usuario no existe');

  const clean = validate(data, current.id);
  const updated = {
    ...current,
    ...clean,
    password: clean.password ?? current.password,
  };
  users = users.map((u) => (u.id === current.id ? updated : u));
  return getSafeUser(updated);
}

// Baja logica: se conserva la cuenta para el historial de ventas.
export function deleteUser(id) {
  const numId = Number(id);
  const current = users.find((u) => u.id === numId);
  if (!current) throw new Error('El usuario no existe');
  if (!current.active) throw new Error('El usuario ya está inactivo');

  const activeAdmins = users.filter((u) => u.active && u.role === 'admin');
  if (current.role === 'admin' && activeAdmins.length === 1)
    throw new Error('No se puede desactivar al único administrador activo');

  users = users.map((u) => (u.id === numId ? { ...u, active: false } : u));
}

export function authenticateUser(username, password) {
  const u = users.find(
    (current) =>
      current.username === String(username ?? '').trim() &&
      current.password === String(password ?? '') &&
      current.active,
  );
  if (!u) return null;
  return getSafeUser(u);
}