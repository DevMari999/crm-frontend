import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserTypes } from '../types/user.types';

interface UsersState {
    managers: UserTypes[];
    currentUser: UserTypes | null;
    isLoading: boolean;
}

const initialState: UsersState = {
    managers: [],
    currentUser: null,
    isLoading: false,
};

export const fetchManagers = createAsyncThunk(
    'users/fetchManagers',
    async (): Promise<UserTypes[]> => { // Removed the page parameter
        const response = await fetch(`http://localhost:8080/api/users/managers`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as UserTypes[];
    }
);

export const setCurrentUser = createAsyncThunk(
    'users/setCurrentUser',
    async (userId: string): Promise<UserTypes> => {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Could not fetch user data');
        }
        return await response.json() as UserTypes;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.managers = action.payload; // Adjusted for direct assignment
            })
            .addCase(fetchManagers.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(setCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            });
    },
});

export default usersSlice.reducer;
