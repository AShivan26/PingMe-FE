import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { UserContext } from './UserContext';
import * as THREE from 'three';

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserId, setToken } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials and try again.');
            }

            const data = await response.json();
            setUserId(data.userId);
            setToken(data.jwt);
            navigate("/chat");
        } catch (error) {
            setError(error.message);
            navigate('/register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="animated-bg">
        <div className="black-hole"/>
        <div className="shooting-stars"/>
                <form onSubmit={handleSubmit} className="login-form">                    
                    <h2>PingMe Messenger</h2>
                    <h3>Login</h3>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;