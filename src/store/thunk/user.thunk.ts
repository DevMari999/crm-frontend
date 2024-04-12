import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from "axios";
import api from "../../service/service";
import {ErrorResponse} from "../../types/error.types";


export const fetchManagers = createAsyncThunk(
    'users/fetchManagers',
    async ({ page, limit, sortBy = 'created_at', sortOrder = 'desc' }: { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy,
                sortOrder,
            }).toString();

            const response = await api.get(`/api/users/managers?${queryParams}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Network response was not ok');
        }
    }
);

export const addManager = createAsyncThunk(
    'users/addManager',
    async (managerData: { name: string; lastname: string; email: string }, { dispatch, rejectWithValue }) => {
        try {
            const requestData = {
                ...managerData,
                created_at: new Date()
            };

            const response = await api.post(`/api/auth/register`, requestData);
            dispatch(fetchManagers({ page: 1, limit: 3 }));
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Network response was not ok');
        }
    }
);


export const setCurrentUser = createAsyncThunk(
    'users/setCurrentUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/users/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Could not fetch user data');
        }
    }
);

export const generateActivationLinkForManager = createAsyncThunk(
    'users/generateActivationLinkForManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/auth/generate-activation-link/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to generate activation link');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'users/resetPassword',
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/auth/set-password`, {
                token,
                password
            });
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to reset password');
        }
    }
);

export const banManager = createAsyncThunk(
    'users/banManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/users/managers/ban/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to ban manager');
        }
    }
);

export const unbanManager = createAsyncThunk(
    'users/unbanManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/users/managers/unban/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to unban manager');
        }
    }
);

export const deleteManager = createAsyncThunk(
    'users/deleteManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/users/managers/${userId}`);
            return userId;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to delete manager');
        }
    }
);
