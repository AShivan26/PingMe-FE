import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { UserContext } from './UserContext';
import video from '../video/bg.mp4'

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const navigate = useNavigate();
    const { setUserId, setToken } = useContext(UserContext);    

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setIsEmailValid(validateEmail(emailValue));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        

        if (!isEmailValid) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }
  
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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
        <div className="video-background">
            <video autoPlay loop muted playsInline>
                <source src={video} type="video/mp4" />
            </video>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <h2>PingMe Messenger</h2>
                    <div className="form-group">
                        <label htmlFor="email">Email ID</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            className={isEmailValid ? '' : 'invalid'}
                            required
                        />
                        {!isEmailValid && <p className="error">Please enter a valid email address.</p>}
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p>{error}</p>}
                </form>
                <p>
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>      
        </div>
    );
};

export default LoginForm;