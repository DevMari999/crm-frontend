import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserDetailsFromToken } from '../utils/tokenUtils';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const userDetails = getUserDetailsFromToken();
    console.log("User Details: ", userDetails);

    if (!userDetails || !userDetails.userRole) {
        console.log("Redirecting to login, no user details found or userRole missing.");
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(userDetails.userRole)) {
        console.log("Redirecting to not-found, role not allowed.");
        return <Navigate to="/not-found" replace />;
    }

    return <>{children}</>;
};
