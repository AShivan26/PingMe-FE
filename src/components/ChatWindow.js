import React from 'react';
import './ChatWindow.css'; // Add styles for chat window

const ChatWindow = ({ selectedUser, onClose }) => {
    if (!selectedUser) return null;

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>Chat with {selectedUser.name}</h2>
                <button onClick={onClose} className="close-button">X</button>
            </div>
            <div className="chat-messages">
                {/* Display chat messages here */}
                <p>Messages go here...</p>
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
