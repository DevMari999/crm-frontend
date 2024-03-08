import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Order, PaginationResult} from '../types/order.types';
import {CourseTypeStatistics, MonthlyOrderStats, OrdersState} from "../types/orders.slice.types";

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
    statusStatistics: {},
    monthlyStats: [],
    courseTypeStatistics: {},
};

export const fetchCourseTypeStatistics = createAsyncThunk(
    'orders/fetchCourseTypeStatistics',
    async (): Promise<CourseTypeStatistics> => {
        const response = await fetch(`http://localhost:8080/api/course-type-statistics`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as CourseTypeStatistics;
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
        const response = await fetch(`http://localhost:8080/api/orders?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as PaginationResult;
    }
);


export const addCommentToOrder = createAsyncThunk(
    'orders/addCommentToOrder',
    async ({ orderId, comment, managerId }: { orderId: string; comment: string; managerId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ comment, managerId }),
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
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/comments/${commentId}`, {
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




export const fetchStatusStatistics = createAsyncThunk(
    'orders/fetchStatusStatistics',
    async (): Promise<Record<string, number>> => {
        const response = await fetch(`http://localhost:8080/api/orders/status-statistics`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data as Record<string, number>;
    }
);


export const fetchOrdersGroupedByMonth = createAsyncThunk(
    'orders/fetchOrdersGroupedByMonth',
    async (): Promise<MonthlyOrderStats[]> => {
        const response = await fetch(`http://localhost:8080/api/orders-by-month`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as MonthlyOrderStats[];
    }
);

export const fetchAllOrdersForExcel = createAsyncThunk(
    'orders/fetchAllOrdersForExcel',
    async (): Promise<Order[]> => {
        const response = await fetch(`http://localhost:8080/api/orders/excel`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Order[];
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
            .addCase(fetchStatusStatistics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStatusStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.statusStatistics = action.payload;
            })
            .addCase(fetchStatusStatistics.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchOrdersGroupedByMonth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrdersGroupedByMonth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.monthlyStats = action.payload;
            })
            .addCase(fetchOrdersGroupedByMonth.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchCourseTypeStatistics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourseTypeStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseTypeStatistics = action.payload; // Set the fetched course type statistics in the state
            })
            .addCase(fetchCourseTypeStatistics.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllOrdersForExcel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllOrdersForExcel.fulfilled, (state, action) => {
                state.isLoading = false;
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
    setRowExpanded,
    setExpandedRow
} = ordersSlice.actions;
export default ordersSlice.reducer;
