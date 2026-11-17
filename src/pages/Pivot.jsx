import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Pivot = () => {

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if(!user) 
            navigate('/login', { replace: true })
        else if(user?.role === 'admin') 
            navigate('/products', { replace: true })
        else navigate('/sales', { replace: true })
    }, [])

    return null;
}
