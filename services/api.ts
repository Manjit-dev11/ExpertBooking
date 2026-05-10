import axios from 'axios'
import Toast from 'react-native-toast-message'

// Uses the API URL from your frontend .env file
const API_URL = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Only show "offline" when the device genuinely cannot reach the server
// (no response at all). Do NOT show it for 4xx/5xx API errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkFailure =
      !error.response && // no HTTP response received
      (error.message === 'Network Error' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT')

    if (isNetworkFailure) {
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

