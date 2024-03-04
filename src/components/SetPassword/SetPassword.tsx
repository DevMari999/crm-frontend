import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams<'token'>();

    const handleSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/set-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activationToken: token,
                    newPassword: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to set new password');
            }

            alert('Password set successfully. Your account is now active.');
            navigate('/login');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSetPassword}>
                <div>
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Set Password</button>
            </form>
        </div>
    );
};

export default SetPassword;
