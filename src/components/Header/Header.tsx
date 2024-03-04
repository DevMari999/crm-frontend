import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import "./Header.css";
// @ts-ignore
import home from "../../assets/home.png";
// @ts-ignore
import logOut from "../../assets/logOut.png";
// @ts-ignore
import admin from "../../assets/admin.png";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="header">
            <div className="panel">
                <img className="panel-logo" src={home} alt="home" onClick={() => navigate('/orders')} />
                <img className="panel-logo" src={admin} alt="admin" onClick={() => navigate('/admin')} />
                <img className="panel-logo" src={logOut} alt="logOut" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default Header;
