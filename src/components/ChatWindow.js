import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext'; // Import UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ChatWindow.css'; // Add styles for chat window

const ChatWindow = ({ selectedUser, onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { userId, setUserId } = useContext(UserContext); // Access userId and setUserId from context
    const navigate = useNavigate(); // Initialize navigate

    if (!selectedUser) return null;

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { user: 'You', text: message }]);
            setMessage(''); // Clear the input field
        }
    };

    const handleLogout = async () => {
        try {
            // Replace `{{baseURL}}` with your actual base URL
            const response = await fetch(`http://localhost:8080/pingme/logout/${userId}`, {
                method: 'GET', // Typically, POST is used for logout requests
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed. Please try again.');
            }

            // Clear user ID from context
            setUserId(null);

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error.message);
            // Optionally, display an error message to the user
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>Chat with {selectedUser.name}</h2>
                <button onClick={onClose} className="close-button">X</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div className="logout-container">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default ChatWindow;
