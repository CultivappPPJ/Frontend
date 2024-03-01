import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, BackendError, SignInData, SignUpData } from '../../types';

const IDLE = 'idle';
const LOADING = 'loading';
const FAILED = 'failed';

const initialState: AuthState = {
  token: null,
  status: IDLE,
  error: null,
};

export const signIn = createAsyncThunk<
  string,
  SignInData,
  { rejectValue: BackendError }
>(
  'auth/signIn',
  async (signInData: SignInData, { rejectWithValue }) => {
    try {
      const response = await axios.post(import.meta.env.VITE_SIGNIN, signInData);
      return response.data?.token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendError = error.response.data?.error ? { message: error.response.data?.error } : { message: "Ocurrió un error inesperado" };
        return rejectWithValue(backendError as BackendError);
      }
      return rejectWithValue({ message: "Ocurrió un error inesperado" });
    }
  }
);


export const signUp = createAsyncThunk<
  string,
  SignUpData,
  { rejectValue: BackendError }
>(
  'auth/signUp',
  async (signUpData: SignUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIGNUP}`, signUpData);
      return response.data?.token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendError = error.response.data?.error ? { message: error.response.data?.error } : { message: "Ocurrió un error inesperado" };
        return rejectWithValue(backendError as BackendError);
      }
      return rejectWithValue({ message: "Ocurrió un error inesperado" } as BackendError);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.status = IDLE;
      state.error = null;
      localStorage.removeItem('token');
    },
    setToken: (state, { payload }) => {
      state.token = payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.status = IDLE;
        state.token = payload;
        localStorage.setItem('token', payload);
      })
      .addCase(signIn.rejected, (state, { payload, error }) => {
        state.status = FAILED;
        state.error = payload?.message || error.message;
      })
      .addCase(signUp.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.status = IDLE;
        state.token = payload;
        localStorage.setItem('token', payload);
      })
      .addCase(signUp.rejected, (state, { payload, error }) => {
        state.status = FAILED;
        state.error = payload?.message || error.message;
      });
  },
});

export const { logout, setToken, clearError } = authSlice.actions;

export default authSlice.reducer;
