import { useState } from 'react'
import { loadData, saveData } from '../services/storageService'
import DataContext from './dataContext'

function createSale(data, employeeId, cartItems) {
  const employee = data.users.find(
    (user) =>
      String(user.id) === String(employeeId) &&
      user.active &&
      ['employee', 'empleado'].includes(user.role?.toLowerCase()),
  )

  if (!employee) {
    throw new Error('Solo un empleado activo puede registrar una venta.')
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('No se puede registrar una venta sin productos.')
  }

  const quantities = []

  cartItems.forEach((item) => {
    if (
      item === null ||
      typeof item !== 'object' ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error('Cada producto debe tener una cantidad entera mayor que cero.')
    }

    const existingItem = quantities.find(
      (quantity) => String(quantity.productId) === String(item.productId),
    )

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      quantities.push({ productId: item.productId, quantity: item.quantity })
    }
  })

  const items = quantities.map(({ productId, quantity }) => {
    const product = data.products.find(
      (currentProduct) => String(currentProduct.id) === String(productId),
    )

    if (!product || !product.active) {
      throw new Error('La venta contiene un producto inexistente o inactivo.')
    }

    if (
      !Number.isFinite(product.stock) ||
      product.stock < 0 ||
      !Number.isFinite(product.price) ||
      product.price < 0
    ) {
      throw new Error(`El producto "${product.name}" tiene precio o stock inválido.`)
    }

    if (quantity > product.stock) {
      throw new Error(`No hay stock suficiente de "${product.name}".`)
    }

    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      subtotal: product.price * quantity,
    }
  })

  const sale = {
    id: data.sales.reduce((highestId, currentSale) => {
      if (Number.isFinite(currentSale.id) && currentSale.id > highestId) {
        return currentSale.id
      }

      return highestId
    }, 0) + 1,
    employeeId: employee.id,
    date: new Date().toISOString(),
    items,
    total: items.reduce((total, item) => total + item.subtotal, 0),
  }
  const products = data.products.map((product) => {
    const soldItem = items.find(
      (item) => String(item.productId) === String(product.id),
    )

    if (!soldItem) {
      return product
    }

    return { ...product, stock: product.stock - soldItem.quantity }
  })

  return {
    ...data,
    products,
    sales: [...data.sales, sale],
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData)

  function updateCollection(collection, nextCollection) {
    if (!Object.hasOwn(data, collection)) {
      throw new Error(`La colección "${collection}" no existe.`)
    }

    if (!Array.isArray(nextCollection)) {
      throw new Error(`La colección "${collection}" debe ser un arreglo.`)
    }

    const nextData = { ...data, [collection]: nextCollection }
    saveData(nextData)
    setData(nextData)
  }

  function completeSale(employeeId, cartItems) {
    const nextData = createSale(data, employeeId, cartItems)
    saveData(nextData)
    setData(nextData)

    return nextData.sales[nextData.sales.length - 1]
  }

  return (
    <DataContext.Provider value={{ ...data, updateCollection, completeSale }}>
      {children}
    </DataContext.Provider>
  )
}
