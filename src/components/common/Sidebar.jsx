import {
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  Users,
  Receipt,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import '../styles/Sidebar.css'

const adminItems = [
  { label: 'Productos', to: '/products', icon: Package },
  { label: 'Categorías', to: '/categories', icon: Tag },
  { label: 'Proveedores', to: '/providers', icon: Truck },
  { label: 'Usuarios', to: '/users', icon: Users },
]

const employeeItems = [
  { label: 'Nueva venta', to: '/sales', icon: ShoppingCart },
  { label: 'Historial de ventas', to: '/sales/history', icon: Receipt },
]

export const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = user?.role === 'admin'
    ? adminItems
    : user?.role === 'empleado'
      ? employeeItems
      : []

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar d-flex flex-column p-3 text-white" aria-label="Navegación principal">
      <div className="sidebar__brand d-flex align-items-center gap-3 px-2">
        <Store className="sidebar__brand-icon flex-shrink-0" aria-hidden="true" />
        <span>
          Kiosco
          <strong>Don Ramón</strong>
        </span>
      </div>

      <nav className="nav nav-pills flex-column gap-2 mt-4" aria-label="Secciones">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `nav-link d-flex align-items-center gap-3 sidebar__link${isActive ? ' active' : ''}`}
            end
            key={to}
            to={to}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="btn sidebar__logout text-white d-flex align-items-center gap-3 mt-auto w-100 text-start" onClick={handleLogout} type="button">
        <LogOut size={20} aria-hidden="true" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  )
}