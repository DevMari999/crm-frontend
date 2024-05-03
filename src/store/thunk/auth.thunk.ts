import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/service';
import axios, { AxiosError } from 'axios';
import {ErrorResponse} from "../../types/error.types";
import {RootState} from "../store";

interface User {
    userId: string;
    email: string;
    name: string;
    lastname?: string;
    role: string;
}



export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { dispatch, rejectWithValue, getState }) => {
        const state = getState() as RootState;
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
            return rejectWithValue('No refresh token available');
        }

        try {
            const response = await api.post('/api/auth/refresh', { refreshToken });
            const { accessToken } = response.data;
            dispatch(fetchUserDetails());
            return accessToken;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(axiosError.response?.data.message || 'An unknown error occurred');
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/auth/user-details');
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to fetch user details');
        }
    }
);
