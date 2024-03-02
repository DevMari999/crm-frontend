import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Order, PaginationResult} from '../types/order.types';

interface OrdersState {
    data: Order[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchCriteria: Record<string, any>;
    isRowExpanded: boolean;
    expandedRowId: string | null;
}

const initialState: OrdersState = {
    data: [],
    isLoading: false,
    currentPage: 1,
    totalPages: 0,
    sortBy: 'defaultField',
    sortOrder: 'asc',
    searchCriteria: {},
    isRowExpanded: false,
    expandedRowId: null,
};

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
        const response = await fetch(`http://localhost:8080/api/orders?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as PaginationResult;
    }
);


const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        setSearchCriteria: (state, action: PayloadAction<Record<string, any>>) => {
            state.searchCriteria = action.payload;
        },
        toggleRowExpanded: (state) => { // Add this reducer
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
            });
    },
});

export const {
    setCurrentPage,
    setSortBy,
    setSearchCriteria,
    toggleRowExpanded,
    setRowExpanded,
    setExpandedRow
} = ordersSlice.actions;
export default ordersSlice.reducer;
