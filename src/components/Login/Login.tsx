import React, { FormEvent, useState } from 'react';
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Basic validation for email format
        if (!email.includes('@')) {
            setErrorMessage('Invalid email format');
            return;
        }

        // Reset error message on successful validation
        setErrorMessage('');

        const requestData = JSON.stringify({ email, password });
        console.log('Sending request data:', requestData);

        const loginUrl = 'http://localhost:8080/api/auth/login';

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for including cookies in the request
                body: requestData,
            });

            if (!response.ok) {
                console.error('Login failed:', response.statusText);
                setErrorMessage('Login failed. Please check your credentials.');
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Redirect user or update UI state based on successful login
            window.location.href = '/admin'; // Adjust URL as needed

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
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="login-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
