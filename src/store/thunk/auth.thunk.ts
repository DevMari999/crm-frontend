import {  createAsyncThunk } from '@reduxjs/toolkit';
import config from "../../configs/configs";

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

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/refresh`, {
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
            const response = await fetch(`${config.baseUrl}/api/auth/user-details`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data: User = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
);
