import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {  useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { selectUserRole} from '../../store/slices';
import {useDispatch} from "../../hooks";
import config from "../../configs/configs";
import {fetchUserDetails} from "../../store/thunk";

interface LoginFormInputs {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const [errorMessage, setErrorMessage] = React.useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const userRole = useSelector(selectUserRole);

    const onSubmit = async (data: LoginFormInputs) => {
        const { email, password } = data;
        const loginUrl = `${config.baseUrl}/api/auth/login`;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed. Please check your credentials.');
                return;
            }

            await dispatch(fetchUserDetails()).unwrap();

        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login.');
        }
    };

    useEffect(() => {
        if (userRole === 'admin') {
            navigate('/admin');
        } else if (userRole === 'manager') {
            navigate('/orders');
        }
    }, [userRole, navigate]);


    return (
        <div className="login">
            <div className="form-wrapper">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Welcome</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="form-field">
                        <label htmlFor="email">Email:</label>
                        <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })} type="email" id="email" />
                        {errors.email && <div className="error-message">{errors.email.message}</div>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <input {...register("password", { required: "Password is required" })} type="password" id="password" />
                        {errors.password && <div className="error-message">{errors.password.message}</div>}
                    </div>
                    <button className="login-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
