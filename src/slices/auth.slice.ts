import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface User {
    userId: string;
    email: string;
    name: string;
    lastname?: string;
    role: string;
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
};

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to refresh access token');
            }

            const { accessToken } = await response.json();
            dispatch(fetchUserDetails());
            return accessToken;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/user-details', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data: User = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'idle';
                state.user = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state) => {
                state.status = 'failed';
                state.user = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                console.log('Access token refreshed:', action.payload);
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                console.error('Failed to refresh access token:', action.payload);
                state.user = null;
            });
    },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectUserId = (state: RootState) => state.auth.user?.userId;

export default authSlice.reducer;
