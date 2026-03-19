import { toast } from 'react-toastify'

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (!error) {
    return fallback
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (typeof error.response?.data === 'string') {
    return error.response.data
  }

  if (error.message) {
    return error.message
  }

  return fallback
}

export const showError = (error, fallback) => {
  toast.error(getApiErrorMessage(error, fallback))
}

export const showSuccess = (message) => {
  toast.success(message)
}
