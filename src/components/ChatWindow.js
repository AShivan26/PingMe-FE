import React, {useContext, useEffect, useState} from 'react';
import './ChatWindow.css';
import {UserContext} from "./UserContext"; // Add styles for chat window

const ChatWindow = ({chatId, userName, onClose}) => {
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const {token} = useContext(UserContext);

    useEffect(() => {
        console.log('hello');
        const handleReceiveMessage = async () => {
            try {
                let messageHistory=[];
                const response = await fetch(`http://localhost:8080/pingme/chats/${chatId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                let history = await response.json()
                for (let idx in history.messages) {
                    let data = history.messages[idx]
                    messageHistory = [...messageHistory, {user: data.user.name, text: data.content}]
                    setMessages(messageHistory);
                }
            } catch (error) {
                console.error('Receive chat endpoint failed', error);
            }
        };
        handleReceiveMessage()
    }, []);

    const handleSendMessage = async () => {
        try {
            await fetch('http://localhost:8080/pingme/messages/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({chatId, content}),
            });
        } catch (error) {
            console.error('Create chat endpoint failed', error);
        }
        if (content.trim()) {
            setMessages([...messages, {user: 'You', text: content}]);
            setContent('');
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>Chat {userName}</h2>
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;