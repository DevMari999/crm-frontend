export interface Comment {
    _id: string;
    managerId: string;
    comment: string;
    createdAt: Date;
    managerName?: string;
}

export interface Order {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number | null;
    already_paid: boolean | null;
    created_at: Date;
    utm: string;
    msg: string | null;
    status: string | null;
    group: string | null;
    manager: string | null;
    comments: Comment[];
}

export interface PaginationResult {
    currentData: Order[];
    totalPages: number;
}

export interface CommentInput {
    [orderId: string]: string;
}

export interface StatusStatistic {
    _id: string | null;
    count: number;
}

export interface ChartDataState {
    labels: string[];
    datasets: Array<{
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
        borderWidth?: number;
    }>;
}

export interface MonthlyStat {
    _id: {
        month: string;
        year: string;
    };
    count: number;
}
