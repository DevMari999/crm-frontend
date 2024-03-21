import { createSlice} from '@reduxjs/toolkit';
import {UsersState} from '../../types';
import {RootState} from "../store";
import {
    banManager,
    deleteManager,
    fetchManagers,
    generateActivationLinkForManager, resetPassword,
    setCurrentUser,
    unbanManager
} from "../thunk";

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
                console.log('Current user data:', action.payload);
                state.currentUser = action.payload;
            })

            .addCase(setCurrentUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(generateActivationLinkForManager.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generateActivationLinkForManager.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log('Activation link generated:', action.payload);
            })
            .addCase(generateActivationLinkForManager.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(banManager.fulfilled, (state, action) => {
                const index = state.managers.findIndex(manager => manager._id === action.payload._id);
                if (index !== -1) {
                    state.managers[index].banned = true;
                }
            })
            .addCase(unbanManager.fulfilled, (state, action) => {
                const index = state.managers.findIndex(manager => manager._id === action.payload._id);
                if (index !== -1) {
                    state.managers[index].banned = false;
                }
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.managers = state.managers.filter(manager => manager._id !== action.payload);
            });
    },
});

export const { setPage } = usersSlice.actions;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export default usersSlice.reducer;
