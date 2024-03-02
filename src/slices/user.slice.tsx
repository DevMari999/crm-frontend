import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {UserTypes} from '../types/user.types';

interface UsersState {
    managers: UserTypes[];
    pagination: {
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    currentUser: UserTypes | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    managers: [],
    pagination: {
        totalPages: 0,
        currentPage: 1,
        limit: 5,
    },
    currentUser: null,
    isLoading: false,
    error: null,
};

export const fetchManagers = createAsyncThunk(
    'users/fetchManagers',
    async ({page, limit}: { page: number, limit: number }, {rejectWithValue}) => {
        console.log(`Fetching managers: Page ${page}, Limit ${limit}`);
        try {
            const response = await fetch(`http://localhost:8080/api/users/managers?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const setCurrentUser = createAsyncThunk(
    'users/setCurrentUser',
    async (userId: string, {rejectWithValue}) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`);
            if (!response.ok) {
                throw new Error('Could not fetch user data');
            }
            return await response.json() as UserTypes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.managers = action.payload.users;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.currentPage = action.payload.currentPage;
                state.pagination.limit = action.payload.limit;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(setCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(setCurrentUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {setPage} = usersSlice.actions;

export default usersSlice.reducer;
