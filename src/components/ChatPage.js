import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import './ChatPage.css';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const { userId, setUserId } = useContext(UserContext);
    const { token, setToken, userName} = useContext(UserContext);
    const [ chatId, setChatId ] = useState("");
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        console.log(token);
        if (!token) {
            navigate('/login');
        }

        const handleUnload = async () => {
            try {
                // Perform logout request when user leaves the page
                await fetch(`http://localhost:8080/pingme/chats/logout`, {
                    method: 'POST', // or GET depending on your API
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
    }, [navigate, userId, token]);

    if (!token) {
        return null;
    }

    const handleUserSelect = async (toUserId) => {
        try {
            let response = await fetch(`http://localhost:8080/pingme/chats/user`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            }); 
            let data = await response.json();
            const filteredChats = data.filter(chat =>
                chat.users.some(user => user.id === toUserId)
            );
            if (filteredChats.length > 0) {
                setChatId(filteredChats[0].id);
                console.log(filteredChats[0].users[1].name)
                setSelectedUser(filteredChats[0].users[1].name);
            } else {                          
                response = await fetch(`http://localhost:8080/pingme/chats/single`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token}`,
                    },
                    body: JSON.stringify({ toUserId }),
                }); 
                data = await response.json();
                setChatId(data.id);
                setSelectedUser(data.users[1].name);
            }
        } catch (error) {
            console.error('Chat request failed', error);
        }
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    const handleLogout = async () => {
        try {
            await fetch(`http://localhost:8080/pingme/chats/logout`, {
                method: 'POST', // or GET depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Logout request failed', error);
        } finally {
            setUserId(null);
            setToken(null);
            navigate('/login');
        }
    };

    return (
        <div className="chat-page">
            <nav className="navbar">
                <div className="navbar-brand">PingMe Chat</div>
                <div className="navbar-user">
                    <span>Welcome, {userName}</span>
                    <button onClick={handleLogout} userName={userName} className="logout-button">Logout</button>
                </div>
            </nav>
            <div className="chat-content">
                <div className="user-list-container">
                    <UserList userId={userId} onUserSelect={handleUserSelect} />
                </div>
                <div className="chat-area">
                    {selectedUser ? (
                        <ChatWindow chatId={chatId} userName={selectedUser} onClose={handleCloseChat} />
                    ) : (
                        <div className="no-chat-message">Select a user to start chatting</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
