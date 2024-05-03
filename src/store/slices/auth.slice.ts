import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {fetchUserDetails, refreshAccessToken} from "../thunk";

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
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    accessToken: null,
    refreshToken: null
};


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
