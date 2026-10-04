import { useContext } from 'react'
import { RestaurantStateContext } from './restaurantStateContext'

export function useRestaurantState() {
  const state = useContext(RestaurantStateContext)
  if (!state) throw new Error('useRestaurantState must be used inside RestaurantStateProvider')
  return state
}
