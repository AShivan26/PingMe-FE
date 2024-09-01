import React, { useState } from 'react';
import './ChatWindow.css'; // Add styles for chat window

const ChatWindow = ({ selectedUser, onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    if (!selectedUser) return null;

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { user: 'You', text: message }]);
            setMessage(''); // Clear the input field
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
        </div>
    );
};

export default ChatWindow;