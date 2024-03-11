import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole, selectAuthStatus } from '../slices';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

 const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const userRole = useSelector(selectUserRole);
    const authStatus = useSelector(selectAuthStatus);


    if (authStatus === 'loading') {

        return <div>Loading...</div>;
    }

    if (!userRole) {
        console.log("Redirecting to login, no user details found or userRole missing.");
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log("Redirecting to not-found, role not allowed.");
        return <Navigate to="/not-found" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
