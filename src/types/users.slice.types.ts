import {UserTypes} from "./user.types";

export interface UsersState {
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

