import users from '../data/users.json'
import products from '../data/products.json'
import categories from '../data/categories.json'
import providers from '../data/providers.json'
import sales from '../data/sales.json'

const DATA_STORAGE_KEY = 'kiosco-don-ramon:data'
const SESSION_STORAGE_KEY = 'kiosco-don-ramon:session'

const initialData = {
  users,
  products,
  categories,
  providers,
  sales,
}

export function loadData() {
  const storedData = window.localStorage.getItem(DATA_STORAGE_KEY)

  if (storedData === null) {
    return initialData
  }

  let parsedData

  try {
    parsedData = JSON.parse(storedData)
  } catch (error) {
    throw new Error('No se pudieron leer los datos guardados de la aplicación.', {
      cause: error,
    })
  }

  if (parsedData === null || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
    throw new Error('Los datos guardados de la aplicación tienen un formato inválido.')
  }

  return Object.fromEntries(
    Object.entries(initialData).map(([collection, defaults]) => {
      const savedCollection = Object.hasOwn(parsedData, collection)
        ? parsedData[collection]
        : defaults

      if (!Array.isArray(savedCollection)) {
        throw new Error(`La colección "${collection}" guardada tiene un formato inválido.`)
      }

      return [collection, savedCollection]
    }),
  )
}

export function saveData(data) {
  window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data))
}

export function loadSessionUserId() {
  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (storedSession === null) {
    return null
  }

  let session

  try {
    session = JSON.parse(storedSession)
  } catch (error) {
    throw new Error('No se pudo leer la sesión guardada.', { cause: error })
  }

  if (
    session === null ||
    typeof session !== 'object' ||
    (typeof session.userId !== 'number' && typeof session.userId !== 'string')
  ) {
    throw new Error('La sesión guardada tiene un formato inválido.')
  }

  return session.userId
}

export function saveSessionUserId(userId) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId }))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}
