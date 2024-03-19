import React from 'react';
import { useNavigate } from 'react-router-dom';

const MobileWarningPage = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', marginTop: '100px' }}>
            <h1>Mobile Device Detected</h1>
            <p>This application is not optimized for mobile devices.</p>
            <button onClick={handleContinue}>
                Continue Anyway
            </button>
        </div>
    );
};

export default MobileWarningPage;
