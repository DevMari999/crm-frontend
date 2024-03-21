import {createAsyncThunk} from '@reduxjs/toolkit';
import {Order,  PaginationResult} from "../../types";
import config from "../../configs/configs";
import { Comment } from '../../types';
export const fetchOrderStatsByManager = createAsyncThunk(
    'groups/fetchGroupStatistics',
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/orders/order-stats-by-manager`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({page, sortBy, sortOrder, searchCriteria}:
               {
                   page: number,
                   sortBy: string,
                   sortOrder: 'asc' | 'desc',
                   searchCriteria: Record<string, any>
               }): Promise<PaginationResult> => {
        const queryParams = new URLSearchParams({page: page.toString(), sortBy, sortOrder});
        queryParams.set('searchCriteria', JSON.stringify(searchCriteria));
        const response = await fetch(`${config.baseUrl}/api/orders?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as PaginationResult;
    }
);


export const addCommentToOrder = createAsyncThunk(
    'orders/addCommentToOrder',
    async ({orderId, comment, managerId, managerName}: {
        orderId: string;
        comment: string;
        managerId: string;
        managerName: string
    }, {rejectWithValue}) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/orders/${orderId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({comment, managerId, managerName}),
            });

            if (!response.ok) {
                throw new Error('Failed to add the comment.');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.toString());
        }
    }
);


export const deleteCommentFromOrder = createAsyncThunk(
    'orders/deleteCommentFromOrder',
    async ({orderId, commentId}: { orderId: string; commentId: string }, {rejectWithValue}) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/orders/${orderId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the comment.');
            }

            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.toString());
        }
    }
);

export const fetchAllOrdersForExcel = createAsyncThunk(
    'orders/fetchAllOrdersForExcel',
    async (): Promise<Order[]> => {
        const response = await fetch(`${config.baseUrl}/api/orders/excel`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Order[];
    }
);

export const fetchUniqueGroupNames = createAsyncThunk(
    'orders/fetchUniqueGroupNames',
    async (): Promise<string[]> => {
        const response = await fetch(`${config.baseUrl}/api/orders/groups/unique-names`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
);

export const fetchCommentsForOrder = createAsyncThunk<Comment[], string>(
    'orders/fetchCommentsForOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/orders/${orderId}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            return data as Comment[];
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
);

