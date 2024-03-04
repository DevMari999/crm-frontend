export interface UserTypes {
    _id: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    isActive: boolean;
    passwordResetToken: string;
    passwordResetExpires: Date;
    role: string;
}

export interface UserPaginationResult {
    currentData: UserTypes[];
    totalPages: number;
}

export interface DecodedToken {
    userId: string;
    userRole: string;
}
