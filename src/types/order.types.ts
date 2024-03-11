export interface Comment {
    _id: string;
    managerId: string;
    comment: string;
    createdAt: Date;
    managerName: string;
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
    groupsError: string | null;
}

export interface PaginationResult {
    currentData: Order[];
    totalPages: number;
}

export interface CommentInput {
    [orderId: string]: string;
}

export interface TempComments {
    [orderId: string]: string[];
}
