import {jwtDecode} from 'jwt-decode';
import {DecodedToken} from '../types/user.types';

export const getUserDetailsFromToken = (): Partial<DecodedToken> => {
    const token = localStorage.getItem('token');
    if (!token) {
        return {};
    }

    try {
        const decodedToken: DecodedToken = jwtDecode(token);
        return {
            userId: decodedToken.userId,
            userRole: decodedToken.userRole,
        };
    } catch (error) {
        console.error('Error decoding token', error);
        return {};
    }
};
