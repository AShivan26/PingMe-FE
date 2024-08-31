import React, { useState } from 'react';
import './LoginForm.css'; // Import the CSS file

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/pingme/login', { // Replace with your backend API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send the username and password in the request body
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials and try again.');
            }

            const data = await response.json();
            // Handle successful login
            console.log('Login successful', data);
            // You might want to redirect the user or store the auth token

        } catch (error) {
            setError(error.message);
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state on input change
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
