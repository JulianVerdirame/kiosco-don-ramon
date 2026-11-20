import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login.jsx'
import { MainLayout } from './layouts/MainLayout.jsx'
import { Pivot } from './pages/Pivot.jsx'
import ProductList from './pages/products/ProductList.jsx'
import ProviderList from './pages/providers/ProviderList.jsx'
import CategoryList from './pages/categories/CategoryList.jsx'
import PointOfSale from './pages/sales/PointOfSale.jsx'
import SalesHistory from './pages/sales/SalesHistory.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Pivot />} />
        <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
        <Route path="/providers" element={<ProtectedRoute><ProviderList /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><h1>Usuarios</h1></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><PointOfSale /></ProtectedRoute>} />
        <Route path="/sales/history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App