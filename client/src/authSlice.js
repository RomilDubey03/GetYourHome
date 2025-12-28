import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient.js";

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/signup", userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/auth/signin",
        credentials
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Google OAuth
export const googleAuth = createAsyncThunk(
  "auth/google",
  async (googleData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/auth/google",
        googleData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Google auth failed");
    }
  }
);

// Check Auth Status
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/v1/auth/check");
      return response.data.data;
    } catch (error) {
      if (error.status === 401) {
        return rejectWithValue(null); // Not logged in
      }
      return rejectWithValue(error.message || "Auth check failed");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.get("/api/v1/auth/signout");
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  "auth/update",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `/api/v1/users/update/${userId}`,
        userData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "auth/delete",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/api/v1/users/delete/${userId}`);
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Delete failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Keep these for saved listings functionality
    removeSavedListing: (state, action) => {
      if (state.currentUser?.saved) {
        state.currentUser.saved = state.currentUser.saved.filter(
          (listingId) => listingId !== action.payload
        );
      }
    },
    addSavedListing: (state, action) => {
      if (state.currentUser?.saved) {
        state.currentUser.saved.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })

      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.currentUser = action.payload;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, removeSavedListing, addSavedListing } =
  authSlice.actions;
export default authSlice.reducer;
