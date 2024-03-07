import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import "./Header.css";
// @ts-ignore
import home from "../../assets/home.png";
// @ts-ignore
import logOut from "../../assets/logOut.png";
// @ts-ignore
import admin from "../../assets/admin.png";
import {DecodedToken} from "../../types/user.types";


const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getUserDetailsFromToken = (): Partial<DecodedToken> => {
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

    const userDetails = getUserDetailsFromToken();
    const isUserAdmin = userDetails.userRole === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="header">
            <div className="panel">
                {isUserAdmin && location.pathname === '/admin' && (
                    <img className="panel-logo" src={home} alt="home" onClick={() => navigate('/orders')}/>
                )}
                {isUserAdmin && location.pathname === '/orders' && (
                    <img className="panel-logo" src={admin} alt="admin" onClick={() => navigate('/admin')}/>
                )}
                <img className="panel-logo" src={logOut} alt="logOut" onClick={handleLogout}/>
            </div>
        </div>
    );
};

export default Header;
