import {configureStore} from '@reduxjs/toolkit';
import ordersReducer from './slices/orders.slice';
import usersReducer from './slices/user.slice';
import authReducer from './slices/auth.slice'
export const store = configureStore({
    reducer: {
        orders: ordersReducer,
        users: usersReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
