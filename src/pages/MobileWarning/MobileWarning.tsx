import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileWarningPageProps {
    onDismiss?: () => void;
}

const MobileWarningPage: React.FC<MobileWarningPageProps> = ({ onDismiss }) => {
    const navigate = useNavigate();

    const handleContinue = () => {
        if (onDismiss) {
            onDismiss();
        } else {
            navigate('/login');
        }
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
