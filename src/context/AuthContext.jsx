import { useEffect, useState } from 'react'
import {
  clearSession,
  loadSessionUserId,
  saveSessionUserId,
} from '../services/storageService'
import { useData } from '../hooks/useData'
import AuthContext from './authContext'

export function AuthProvider({ children }) {
  const { users } = useData()
  const [userId, setUserId] = useState(loadSessionUserId)
  const user = users.find(
    (currentUser) =>
      String(currentUser.id) === String(userId) && currentUser.active,
  )
  const isUserIdValid = users.some(
    (currentUser) =>
      String(currentUser.id) === String(userId) && currentUser.active,
  )

  useEffect(() => {
    if (userId !== null && !isUserIdValid) {
      clearSession()
    }
  }, [isUserIdValid, userId])

  function login(username, password) {
    const authenticatedUser = users.find(
      (currentUser) =>
        currentUser.username === username &&
        currentUser.password === password &&
        currentUser.active,
    )

    if (!authenticatedUser) {
      return {
        success: false,
        message: 'El usuario o la contraseña son incorrectos, o la cuenta está inactiva.',
      }
    }

    saveSessionUserId(authenticatedUser.id)
    setUserId(authenticatedUser.id)

    return {
      success: true,
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
        active: authenticatedUser.active,
      },
    }
  }

  function logout() {
    clearSession()
    setUserId(null)
  }

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, isAuthenticated: Boolean(user), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
