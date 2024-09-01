import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import './ChatPage.css';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const { userId, setUserId } = useContext(UserContext);
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }

        const handleUnload = async () => {
            try {
                // Perform logout request when user leaves the page
                await fetch(`http://localhost:8080/pingme/logout/${userId}`, {
                    method: 'POST', // or GET depending on your API
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Logout request failed', error);
            }
        };

        // Add event listener for page unload
        window.addEventListener('beforeunload', handleUnload);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [navigate, userId]);

    if (!userId) {
        return null;
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    const handleLogout = async () => {
        try {
            await fetch(`http://localhost:8080/pingme/logout/${userId}`, {
                method: 'POST', // or GET depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Logout request failed', error);
        } finally {
            setUserId(null);
            navigate('/login');
        }
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
