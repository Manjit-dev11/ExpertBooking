import axios from 'axios'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

// Uses the API URL from your frontend .env file
// Make sure to rebuild your app or restart the server after changing the .env file
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.7:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Add interceptors for auth tokens or global error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      Toast.show({
        type: 'error',
        text1: 'You are offline 📶',
        text2: 'Please check your internet connection.',
        visibilityTime: 5000,
        position: 'top',
      })
    }
    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)
