import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './RegisterForm.css';
import { UserContext } from './UserContext';
import video from '../video/bg.mp4'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
    const navigate = useNavigate(); // Initialize navigate
    const { setUserId, setToken, setUserName } = useContext(UserContext);

    // Criteria states
    const [criteria, setCriteria] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    });
  
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleEmailChange = (e) => {
      const emailValue = e.target.value;
      setEmail(emailValue);
      setIsEmailValid(validateEmail(emailValue));
    };
  
    const handlePasswordChange = (e) => {
      const passwordValue = e.target.value;
      setPassword(passwordValue);
  
      // Update criteria
      setCriteria({
        length: passwordValue.length >= 8,
        uppercase: /[A-Z]/.test(passwordValue),
        lowercase: /[a-z]/.test(passwordValue),
        number: /\d/.test(passwordValue),
        specialChar: /[\W_]/.test(passwordValue),
      });
  
      // Check if passwords match
      setDoPasswordsMatch(passwordValue === retypePassword);
    };
  
    const handleRetypePasswordChange = (e) => {
      setRetypePassword(e.target.value);
      setDoPasswordsMatch(password === e.target.value);
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

        if (!doPasswordsMatch) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed. Please try again.');
            }

            const data = await response.json();

            console.log('Registration successful', data);

            // Navigate to the chat page on success
            setUserId(data.userId);
            setToken(data.jwt);
            setUserName(data.userName);
            console.log(data.jwt);
            navigate('/chat');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="video-background">
            <video autoPlay loop muted playsInline>
                <source src={video} type="video/mp4" />
            </video>
            <div className='register-form'>
                <h2>Register to PingMe Chat</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
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
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            className={Object.values(criteria).every(Boolean) ? '' : 'invalid'}
                            required
                            onFocus={() => document.getElementById('password-criteria').style.display = 'block'}
                            onBlur={() => document.getElementById('password-criteria').style.display = 'none'}
                        />                        
                        <div id="password-criteria" className="password-criteria" style={{ display: 'none' }}>
                            <p>Password must include:</p>
                            <ul>
                            <li className={criteria.length ? 'valid' : 'invalid'}>At least 8 characters</li>
                            <li className={criteria.uppercase ? 'valid' : 'invalid'}>One uppercase letter</li>
                            <li className={criteria.lowercase ? 'valid' : 'invalid'}>One lowercase letter</li>
                            <li className={criteria.number ? 'valid' : 'invalid'}>One number</li>
                            <li className={criteria.specialChar ? 'valid' : 'invalid'}>One special character</li>
                            </ul>
                        </div>
                        <label htmlFor="retypePassword">Retype Password</label>
                        <input
                            type="password"
                            id="retypePassword"
                            value={retypePassword}
                            onChange={handleRetypePasswordChange}
                            placeholder="Retype Password"
                            className={doPasswordsMatch ? '' : 'invalid'}
                            required
                        /> 
                        {!doPasswordsMatch && <p className="error">Passwords do not match.</p>}
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading} className="register-button">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    {error && <p>{error}</p>}
                </form>
                <p>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
