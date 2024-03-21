import {Order} from "./order.types";
import {Comment} from "./order.types";

interface OrderStatus {
    status: string;
    count: number;
}

interface ManagerOrderStats {
    manager: string;
    statuses: OrderStatus[];
    totalOrders: string;
}

export interface OrdersState {
    data: Order[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchCriteria: Record<string, any>;
    isRowExpanded: boolean;
    expandedRowId: string | null;
    uniqueGroupNames: string[];
    groupsLoading: boolean;
    groupsError: string | null;
    orderStatsByManager: ManagerOrderStats[];
    comments: Comment[];
    commentsLoading: boolean;
}
