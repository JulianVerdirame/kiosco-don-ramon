import { useState } from 'react'
import users from '../data/users.json'
import AuthContext from './authContext'

const SESSION_KEY = 'kiosco-don-ramon:userId'

function getUserWithoutPassword(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    active: user.active,
  }
}

function getInitialUser() {
  const userId = localStorage.getItem(SESSION_KEY)
  const user = users.find(
    (currentUser) =>
      String(currentUser.id) === userId && currentUser.active,
  )

  if (!user) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return getUserWithoutPassword(user)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)

  function login(username, password) {
    const authenticatedUser = users.find(
      (currentUser) =>
        currentUser.username === username &&
        currentUser.password === password &&
        currentUser.active,
    )

    if (!authenticatedUser) {
      return false
    }

    localStorage.setItem(SESSION_KEY, authenticatedUser.id)
    setUser(getUserWithoutPassword(authenticatedUser))
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
