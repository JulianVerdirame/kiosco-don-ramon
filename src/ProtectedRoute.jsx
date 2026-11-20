import { useAuth } from './hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
        navigate('/login', { replace: true })
    }
    }, [])

    return user ? children : null
}