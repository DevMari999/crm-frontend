import {Order} from "./order.types";

export interface MonthlyOrderStats {
    _id: {
        year: number;
        month: number;
    };
    count: number;
    orders: Order[];
}

export interface CourseTypeStatistics {
    [courseType: string]: number;
}

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
    statusStatistics: Record<string, number>;
    monthlyStats: MonthlyOrderStats[];
    courseTypeStatistics: CourseTypeStatistics;
    uniqueGroupNames: string[];
    groupsLoading: boolean;
    groupsError: string | null;
    orderStatsByManager: ManagerOrderStats[];
}
