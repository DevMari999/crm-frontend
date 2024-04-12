import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/service';  // Adjust this path to point to your api.ts file location
import { Order, PaginationResult, Comment } from "../../types";
import  { AxiosError } from 'axios';
import {ErrorResponse} from "../../types/error.types";


export const fetchOrderStatsByManager = createAsyncThunk(
    'groups/fetchGroupStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/orders/order-stats-by-manager');
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'An unknown error occurred');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ page, sortBy, sortOrder, searchCriteria }: {
        page: number;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        searchCriteria: Record<string, any>
    }): Promise<PaginationResult> => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                sortBy,
                sortOrder,
                searchCriteria: JSON.stringify(searchCriteria)
            }).toString();

            const response = await api.get(`/api/orders?${queryParams}`);
            return response.data as PaginationResult;
        } catch (error) {
            throw new Error('Network response was not ok'); // Keeping throw as it gets caught by createAsyncThunk's rejected handler
        }
    }
);

export const addCommentToOrder = createAsyncThunk(
    'orders/addCommentToOrder',
    async ({ orderId, comment, managerId, managerName }: {
        orderId: string;
        comment: string;
        managerId: string;
        managerName: string
    }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/orders/${orderId}/comments`, {
                comment,
                managerId,
                managerName
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to add the comment.');
        }
    }
);

export const deleteCommentFromOrder = createAsyncThunk(
    'orders/deleteCommentFromOrder',
    async ({ orderId, commentId }: { orderId: string; commentId: string }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/orders/${orderId}/comments/${commentId}`);
            return commentId; // Success, return commentId
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to delete the comment.');
        }
    }
);

export const fetchAllOrdersForExcel = createAsyncThunk(
    'orders/fetchAllOrdersForExcel',
    async (): Promise<Order[]> => {
        try {
            const response = await api.get('/api/orders/excel');
            return response.data as Order[];
        } catch (error) {
            throw new Error('Network response was not ok'); // Keeping throw as it gets caught by createAsyncThunk's rejected handler
        }
    }
);

export const fetchUniqueGroupNames = createAsyncThunk(
    'orders/fetchUniqueGroupNames',
    async (): Promise<string[]> => {
        try {
            const response = await api.get('/api/orders/groups/unique-names');
            return response.data;
        } catch (error) {
            throw new Error('Network response was not ok'); // Keeping throw as it gets caught by createAsyncThunk's rejected handler
        }
    }
);

export const fetchCommentsForOrder = createAsyncThunk<Comment[], string>(
    'orders/fetchCommentsForOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/orders/${orderId}/comments`);
            return response.data as Comment[];
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data.message || 'Failed to fetch comments');
        }
    }
);
