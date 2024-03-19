import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Header.css";
import home from "../../assets/home.png";
import logOut from "../../assets/logOut.png";
import admin from "../../assets/admin.png";
import { useSelector } from 'react-redux';
import { fetchUserDetails, selectUserRole, selectUser } from '../../slices';
import { useDispatch } from "../../hooks";
import config from "../../configs/configs";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const userRole = useSelector(selectUserRole);
    const currentUser = useSelector(selectUser);

    const isUserAdmin = userRole === 'admin';

    const handleLogout = async () => {
        await fetch(`${config.baseUrl}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch(fetchUserDetails());
        navigate('/login');
    };

    return (
        <div className="header">
            <div className="panel">
                <div className="welcome-message">
                    {currentUser && <p>Welcome, {currentUser.name}!</p>}
                </div>
                {isUserAdmin && location.pathname === '/admin' && (
                    <img className="panel-logo" src={home} alt="home" onClick={() => navigate('/orders')} />
                )}
                {isUserAdmin && location.pathname === '/orders' && (
                    <img className="panel-logo" src={admin} alt="admin" onClick={() => navigate('/admin')} />
                )}
                <img className="panel-logo" src={logOut} alt="logOut" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default Header;
