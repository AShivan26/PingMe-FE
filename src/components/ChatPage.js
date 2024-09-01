import React, {useState, useContext, useEffect} from 'react';
import { UserContext } from './UserContext';
import './ChatPage.css';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import ChatWindow  from "./ChatWindow";

const ChatPage = () => {
    const { userId } = useContext(UserContext); // Access userId from context
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

    return (
        <div className="chat-page">
            <div className="user-list-container">
                <UserList userId={userId} onUserSelect={handleUserSelect} />
            </div>
            <div className="chat-area">
                <h2>Welcome to the chat, {userId}</h2>
                {selectedUser && (
                    <ChatWindow selectedUser={selectedUser} onClose={handleCloseChat} />
                )}
            </div>
        </div>
    );

};

export default ChatPage;