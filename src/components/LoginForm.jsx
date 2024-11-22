import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import the CSS file
import { UserContext } from './UserContext';

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { setUserId } = useContext(UserContext);
    const { setToken } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/auth/login', { // Replace with your backend API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send the email and password in the request body
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials and try again.');
            }

            const data = await response.json();
            // Handle successful login
            console.log('Login successful', data);
            setUserId(data.userId);
            setToken(data.jwt);
            navigate("/chat");


        } catch (error) {
            setError(error.message);
            navigate('/register'); // Redirect to the register page if login fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>PingMe Messenger</h2>
            <h3>Login</h3>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" // Changed to password type for better security
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading} className="login-button">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
