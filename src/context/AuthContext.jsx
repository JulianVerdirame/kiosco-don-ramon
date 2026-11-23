import { useState } from 'react'
import AuthContext from './authContext'
import { authenticateUser, getUserById } from '../services/userService'

const SESSION_KEY = 'kiosco-don-ramon:userId'

function getInitialUser() {
  const userId = localStorage.getItem(SESSION_KEY)
  const user = userId ? getUserById(userId) : null

  if (!user || !user.active) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)

  function login(username, password) {
    const authenticatedUser = authenticateUser(username, password)

    if (!authenticatedUser) {
      return false
    }

    localStorage.setItem(SESSION_KEY, authenticatedUser.id)
    setUser(authenticatedUser)
    return true
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
