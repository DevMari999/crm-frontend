import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {CourseTypeStatistics, MonthlyOrderStats, OrdersState, Order, PaginationResult} from "../types";
import config from "../configs/configs";

const initialState: OrdersState = {
    data: [],
    isLoading: false,
    currentPage: 1,
    totalPages: 0,
    sortBy: 'created_at',
    sortOrder: 'desc',
    searchCriteria: {},
    isRowExpanded: false,
    expandedRowId: null,
    uniqueGroupNames: [],
    groupsLoading: false,
    groupsError: null,
    orderStatsByManager: [],
};


export const fetchOrderStatsByManager = createAsyncThunk(
    'groups/fetchGroupStatistics',
    async (_, { rejectWithValue }) => {
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
    async ({ orderId, comment, managerId, managerName }: { orderId: string; comment: string; managerId: string; managerName: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/orders/${orderId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ comment, managerId, managerName }),
            });

            if (!response.ok) {
                throw new Error('Failed to add the comment.');
            }

            const updatedOrderOrComment = await response.json();
            return updatedOrderOrComment;
        } catch (error: any) {
            return rejectWithValue(error.toString());
        }
    }
);




export const deleteCommentFromOrder = createAsyncThunk(
    'orders/deleteCommentFromOrder',
    async ({ orderId, commentId }: { orderId: string; commentId: string }, { rejectWithValue }) => {
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


const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setSortBy: (state, action: PayloadAction<{ field: string; sortOrder?: 'asc' | 'desc' }>) => {
            state.sortBy = action.payload.field;
            if (action.payload.sortOrder) {
                state.sortOrder = action.payload.sortOrder;
            }
        },

        resetSort: (state) => {
            state.sortBy = 'created_at';
            state.sortOrder = 'desc';
        },
        setSearchCriteria: (state, action: PayloadAction<Record<string, any>>) => {
            state.searchCriteria = action.payload;
        },
        toggleRowExpanded: (state) => {
            state.isRowExpanded = !state.isRowExpanded;
        },
        setRowExpanded: (state, action: PayloadAction<string | null>) => {
            state.expandedRowId = action.payload;
        },
        setExpandedRow: (state, action: PayloadAction<string | null>) => {
            state.expandedRowId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderStatsByManager.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrderStatsByManager.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderStatsByManager = action.payload;
            })
            .addCase(fetchOrderStatsByManager.rejected, (state, action) => {
                state.groupsLoading = false;
                state.groupsError = action.payload as string || 'Failed to fetch groups statistics';
            })

            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.currentData;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllOrdersForExcel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllOrdersForExcel.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(fetchUniqueGroupNames.pending, (state) => {

            })
            .addCase(fetchUniqueGroupNames.fulfilled, (state, action) => {
                state.uniqueGroupNames = action.payload;
            })
            .addCase(fetchUniqueGroupNames.rejected, (state) => {

            })
            .addCase(fetchAllOrdersForExcel.rejected, (state) => {
                state.isLoading = false;

            })
            .addCase(addCommentToOrder.fulfilled, (state, action) => {

                const index = state.data.findIndex(order => order._id === action.meta.arg.orderId);
                if (index !== -1) {

                    state.data[index].comments.push(action.payload);
                }
            })

            .addCase(deleteCommentFromOrder.fulfilled, (state, action) => {

            })

    },

});

export const {
    setCurrentPage,
    setSortBy,
    setSearchCriteria,
    toggleRowExpanded,
    resetSort,
    setRowExpanded,
    setExpandedRow
} = ordersSlice.actions;
export default ordersSlice.reducer;
