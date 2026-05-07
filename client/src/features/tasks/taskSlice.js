import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const url = projectId ? `/api/tasks?projectId=${projectId}` : "/api/tasks";
      const res = await api.get(url);
      return res.data.tasks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/tasks", data);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}/status`, { status });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/edit",
  async ({ taskId, ...data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, data);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to edit task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/tasks/${taskId}`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
    updating: false,
    error: null,
    filter: { status: "all", priority: "all", search: "" },
  },
  reducers: {
    setFilter(state, action) {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearTaskError(state) {
      state.error = null;
    },
    optimisticStatusUpdate(state, action) {
      const { taskId, status } = action.payload;
      const task = state.list.find((t) => t._id === taskId);
      if (task) task.status = status;
    },
  },
  extraReducers: (builder) => {
    const pending = (s) => { s.loading = true; s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.updating = false; s.error = a.payload; };
    const silentPending = (s) => { s.updating = true; s.error = null; };

    builder
      .addCase(fetchTasks.pending, pending)
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchTasks.rejected, rejected)

      .addCase(createTask.pending, pending)
      .addCase(createTask.fulfilled, (s, a) => { s.loading = false; s.list.unshift(a.payload); })
      .addCase(createTask.rejected, rejected)

      .addCase(updateTask.pending, silentPending)
      .addCase(updateTask.fulfilled, (s, a) => {
        s.updating = false;
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.list[idx] = { ...s.list[idx], ...a.payload };
      })
      .addCase(updateTask.rejected, (s, a) => { s.updating = false; s.error = a.payload; })

      .addCase(editTask.pending, silentPending)
      .addCase(editTask.fulfilled, (s, a) => {
        s.updating = false;
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.list[idx] = { ...s.list[idx], ...a.payload };
      })
      .addCase(editTask.rejected, rejected)

      .addCase(deleteTask.pending, silentPending)
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.updating = false;
        s.list = s.list.filter((t) => t._id !== a.payload);
      })
      .addCase(deleteTask.rejected, rejected);
  },
});

export const { setFilter, clearTaskError, optimisticStatusUpdate } = taskSlice.actions;
export default taskSlice.reducer;