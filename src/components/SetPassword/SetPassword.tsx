import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import config from "../../configs/configs";

interface IFormInput {
    password: string;
    confirmPassword: string;
}

const SetPassword: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
    const navigate = useNavigate();
    const { token } = useParams<'token'>();

    const handleSetPassword = async (data: IFormInput) => {
        const { password, confirmPassword } = data;

        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${config.baseUrl}/api/auth/set-password`, {
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
            console.error(error.message);
        }
    };

    return (
        <div className="login">
            <div className="form-wrapper">
                <form className="form" onSubmit={handleSubmit(handleSetPassword)}>
                    <h2>Set New Password</h2>
                    <div className="form-field">
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                }
                            })}
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword", {
                                validate: value =>
                                    value === watch('password') || "The passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    </div>
                    <button className="login-btn" type="submit">Set Password</button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
