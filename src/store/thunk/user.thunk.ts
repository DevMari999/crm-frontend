import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import config from "../../configs/configs";

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

            const response = await fetch(`${config.baseUrl}/api/users/managers?${queryParams}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const addManager = createAsyncThunk(
    'users/addManager',
    async (managerData: { name: string; lastname: string; email: string }, { dispatch, rejectWithValue }) => {
        try {
            const currentDate = new Date();


            const requestData = {
                ...managerData,
                created_at: currentDate
            };

            const response = await fetch(`${config.baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            dispatch(fetchManagers({ page: 1, limit: 3 }));

            return responseData;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const setCurrentUser = createAsyncThunk(
    'users/setCurrentUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/users/${userId}`);
            if (!response.ok) {
                throw new Error('Could not fetch user data');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const generateActivationLinkForManager = createAsyncThunk(
    'users/generateActivationLinkForManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/generate-activation-link/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to generate activation link');
            }
            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'users/resetPassword',
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/set-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const banManager = createAsyncThunk(
    'users/banManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/users/managers/ban/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to ban manager');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const unbanManager = createAsyncThunk(
    'users/unbanManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/users/managers/unban/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to unban manager');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteManager = createAsyncThunk(
    'users/deleteManager',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/users/managers/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete manager');
            }
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
