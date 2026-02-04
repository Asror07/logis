import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from './auth.types'

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

// Helper functions for localStorage
const getStoredToken = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const getStoredUser = (): User | null => {
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const setStoredToken = (key: string, value: string | null): void => {
  try {
    if (value) {
      localStorage.setItem(key, value)
    } else {
      localStorage.removeItem(key)
    }
  } catch {
    // localStorage not available
  }
}

const setStoredUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch {
    // localStorage not available
  }
}

const clearStorage = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // localStorage not available
  }
}

// Initialize state from localStorage
const storedAccessToken = getStoredToken(ACCESS_TOKEN_KEY)
const storedRefreshToken = getStoredToken(REFRESH_TOKEN_KEY)
const storedUser = getStoredUser()

const initialState: AuthState = {
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedAccessToken,
  user: storedUser,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string | null }>
    ) {
      const { accessToken, refreshToken } = action.payload
      state.accessToken = accessToken
      state.isAuthenticated = true

      // Only update refresh token if provided
      if (refreshToken !== null) {
        state.refreshToken = refreshToken
        setStoredToken(REFRESH_TOKEN_KEY, refreshToken)
      }

      setStoredToken(ACCESS_TOKEN_KEY, accessToken)
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      state.isAuthenticated = true
      setStoredToken(ACCESS_TOKEN_KEY, action.payload)
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      setStoredUser(action.payload)
    },

    clearTokens(state) {
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.user = null
      clearStorage()
    },

    logout(state) {
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.user = null
      clearStorage()
    },

    // Initialize auth state from localStorage (called on app startup)
    initializeAuth(state) {
      const accessToken = getStoredToken(ACCESS_TOKEN_KEY)
      const refreshToken = getStoredToken(REFRESH_TOKEN_KEY)
      const user = getStoredUser()

      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = !!accessToken
      state.user = user
    },
  },
})

export const {
  setTokens,
  setAccessToken,
  setUser,
  clearTokens,
  logout,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectUser = (state: { auth: AuthState }) => state.auth.user
