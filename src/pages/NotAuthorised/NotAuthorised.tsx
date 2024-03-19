import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorised = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <p>You can always go back to the <a href="#" onClick={() => navigate('/orders')}>table</a>.</p>
    </div>
);
};

export default NotAuthorised;
