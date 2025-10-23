const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage
  } catch {
    return false
  }
}

export const saveTokens = (access: string, refresh: string) => {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  } catch (error) {
    console.error('Failed to save tokens:', error)
  }
}

export const getAccessToken = () => {
  if (!isLocalStorageAvailable()) return null
  try {
    return localStorage.getItem(ACCESS_KEY)
  } catch (error) {
    console.error('Failed to get access token:', error)
    return null
  }
}

export const getRefreshToken = () => {
  if (!isLocalStorageAvailable()) return null
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch (error) {
    console.error('Failed to get refresh token:', error)
    return null
  }
}

export const clearTokens = () => {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch (error) {
    console.error('Failed to clear tokens:', error)
  }
}
