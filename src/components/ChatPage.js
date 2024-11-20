import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import './ChatPage.css';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const { userId, setUserId } = useContext(UserContext); // Access userId and setUserId from context
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // If no userId is found in sessionStorage, redirect to login
        if (!userId) {
            navigate('/login');
        }
    }, [navigate, userId]);

    if (!userId) {
        return null; // You might want to return a loading spinner or nothing here
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    const handleLogout = () => {
        setUserId(null); // Remove userId from context
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="chat-page">
            <nav className="navbar">
                <div className="navbar-brand">PingMe Chat</div>
                <div className="navbar-user">
                    <span>Welcome, {userId}</span>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </nav>
            <div className="chat-content">
                <div className="user-list-container">
                    <UserList userId={userId} onUserSelect={handleUserSelect} />
                </div>
                <div className="chat-area">
                    {selectedUser ? (
                        <ChatWindow selectedUser={selectedUser} onClose={handleCloseChat} />
                    ) : (
                        <div className="no-chat-message">Select a user to start chatting</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
