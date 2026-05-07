import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/projects')
    return res.data.projects
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects')
  }
})

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/projects', data)
    if (!res.data.success) return rejectWithValue(res.data.message)
    return res.data.project
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project')
  }
})

export const addMember = createAsyncThunk('projects/addMember', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/projects/add-member', data)
    if (!res.data.success) return rejectWithValue(res.data.message)
    return res.data.project
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add member')
  }
})

export const removeMember = createAsyncThunk('projects/removeMember', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/projects/remove-member', data)
    if (!res.data.success) return rejectWithValue(res.data.message)
    return res.data.project
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove member')
  }
})

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (s) => { s.loading = true; s.error = null }
    const rejected = (s, a) => { s.loading = false; s.error = a.payload }

    builder
      .addCase(fetchProjects.pending, pending)
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchProjects.rejected, rejected)

      .addCase(createProject.pending, pending)
      .addCase(createProject.fulfilled, (s, a) => { s.loading = false; s.list.unshift(a.payload) })
      .addCase(createProject.rejected, rejected)

      .addCase(addMember.pending, pending)
      .addCase(addMember.fulfilled, (s, a) => {
        s.loading = false
        const idx = s.list.findIndex(p => p._id === a.payload._id)
        if (idx !== -1) s.list[idx] = a.payload
      })
      .addCase(addMember.rejected, rejected)

      .addCase(removeMember.pending, pending)
      .addCase(removeMember.fulfilled, (s, a) => {
        s.loading = false
        const idx = s.list.findIndex(p => p._id === a.payload._id)
        if (idx !== -1) s.list[idx] = a.payload
      })
      .addCase(removeMember.rejected, rejected)
  },
})

export const { clearProjectError } = projectSlice.actions
export default projectSlice.reducer
