import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login.jsx'
import { MainLayout } from './layouts/MainLayout.jsx'
import { Pivot } from './pages/Pivot.jsx'
import ProductList from './pages/products/ProductList.jsx'
import ProviderList from './pages/providers/ProviderList.jsx'
import CategoryList from './pages/categories/CategoryList.jsx'

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Pivot />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/providers" element={<ProviderList />} />
        <Route path="/users" element={<h1>Usuarios</h1>} />
        <Route path="/sales" element={<h1>Ventas</h1>} />
      </Route>

    </Routes>
  )
}
