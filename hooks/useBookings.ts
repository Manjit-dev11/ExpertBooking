import { useState, useCallback } from 'react'
import { Booking } from '../constants/mockData'
import { api } from '../services/api'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [activeStatus, setActiveStatus] = useState<string>('All')

  const fetchByEmail = useCallback(async (email: string) => {
    try {
      setLoading(true)
      const response = await api.get('/bookings', { params: { email } })
      if (response.data.success) {
        setBookings(response.data.data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addBooking = useCallback(async (bookingData: any) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error: any) {
      console.error('Error creating booking:', error?.response?.data || error)
      throw error?.response?.data || new Error('Failed to create booking')
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' })
      if (response.data.success) {
        setBookings((prev) => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }, [])

  const filteredBookings = activeStatus === 'All'
    ? bookings
    : bookings.filter((b) => b.status === activeStatus.toLowerCase())

  return {
    bookings: filteredBookings,
    allBookings: bookings,
    loading,
    activeStatus,
    setActiveStatus,
    fetchByEmail,
    addBooking,
    cancelBooking,
  }
}
