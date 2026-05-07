import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Helper: persist auth to localStorage
const persistAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

//* Thunks 
export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/auth/signup', data)
    if (!res.data.success) return rejectWithValue(res.data.message)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/auth/login', data)
    if (!res.data.success) return rejectWithValue(res.data.message)
    persistAuth(res.data.token, res.data.user)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

//* Slice 
const storedUser = localStorage.getItem('user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      clearAuth()
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (s) => { s.loading = true; s.error = null })
      .addCase(signup.fulfilled, (s) => { s.loading = false })
      .addCase(signup.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    // Login
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false
        s.user = a.payload.user
        s.token = a.payload.token
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
