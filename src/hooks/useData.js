import { useContext } from 'react'
import DataContext from '../context/dataContext'

export function useData() {
  const context = useContext(DataContext)

  if (context === null) {
    throw new Error('useData debe utilizarse dentro de un DataProvider.')
  }

  return context
}
