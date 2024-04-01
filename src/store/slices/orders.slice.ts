import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { OrdersState} from "../../types";
import {
    fetchOrders,
    fetchOrderStatsByManager,
    addCommentToOrder,
    deleteCommentFromOrder,
    fetchCommentsForOrder,
} from '../thunk';
import {Comment} from "../../types";
import {RootState} from "../store";

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
    comments: [],
    commentsLoading: false
};

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
            .addCase(addCommentToOrder.fulfilled, (state, action) => {

                const index = state.data.findIndex(order => order._id === action.meta.arg.orderId);
                if (index !== -1) {
                    state.data[index].comments.push(action.payload);
                }
            })
            .addCase(deleteCommentFromOrder.fulfilled, (state, action) => {
                const index = state.data.findIndex(order => order.comments.some(comment => comment._id === action.payload));
                if (index !== -1) {
                    state.data[index].comments = state.data[index].comments.filter(comment => comment._id !== action.payload);
                }
            })
            .addCase(fetchCommentsForOrder.pending, (state) => {
                state.commentsLoading = true;
            })
            .addCase(fetchCommentsForOrder.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                state.commentsLoading = false;
                state.comments = action.payload;
            })
            .addCase(fetchCommentsForOrder.rejected, (state) => {
                state.commentsLoading = false;
            });
    },

});

export const {
    setCurrentPage,
    setSortBy,
    setSearchCriteria,
    resetSort,
    setRowExpanded,
    setExpandedRow
} = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectComments = (state: RootState) => state.orders.comments;
