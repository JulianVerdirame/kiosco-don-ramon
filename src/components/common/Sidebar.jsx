import {
  Box,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Sidebar.css'

const adminItems = [
  { label: 'Productos', to: '/products', icon: Package },
  { label: 'Categorías', to: '/categories', icon: Tag },
  { label: 'Proveedores', to: '/providers', icon: Truck },
  { label: 'Usuarios', to: '/users', icon: Users },
]

const employeeItems = [
  { label: 'Nueva venta', to: '/sales', icon: ShoppingCart },
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
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="sidebar__brand">
        <Store className="sidebar__brand-icon" aria-hidden="true" />
        <span>
          Kiosco
          <strong>Don Ramón</strong>
        </span>
      </div>

      <nav className="sidebar__nav" aria-label="Secciones">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
            end
            key={to}
            to={to}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout} type="button">
        <LogOut size={20} aria-hidden="true" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  )
}