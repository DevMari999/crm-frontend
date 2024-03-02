import React, {FormEvent, useState} from 'react';
import "./Login.css";
import {getUserDetailsFromToken} from '../../utils/tokenUtils';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.includes('@')) {
            setErrorMessage('Invalid email format');
            return;
        }

        setErrorMessage('');

        const requestData = JSON.stringify({email, password});
        console.log('Sending request data:', requestData);

        const loginUrl = 'http://localhost:8080/api/auth/login';

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                credentials: 'include',
                body: requestData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login failed:', errorData.message || response.statusText);
                setErrorMessage(errorData.message || 'Login failed. Please check your credentials.');
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);

            try {
                const decoded = getUserDetailsFromToken();
                console.log('Decoded token:', decoded);

                if (decoded.userRole === 'admin') { // Adjusted property name
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/orders';
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setErrorMessage('An error occurred while decoding the token.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login.');
        }
    };


    return (
        <div className="login">
            <div className="form-wrapper">
                <form className="form" onSubmit={handleSubmit}>
                    <h2>Welcome</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="form-field">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
