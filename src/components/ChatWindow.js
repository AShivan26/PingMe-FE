import React, {useContext, useEffect, useState} from 'react';
import './ChatWindow.css';
import {UserContext} from "./UserContext"; // Add styles for chat window
import SockJs from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

const ChatWindow = ({chatId, userName, onClose}) => {
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const {token} = useContext(UserContext);

    const connect = () => {
        const sock = new SockJs("http://localhost:8080/ws");
        const temp = over(sock);
        setStompClient(temp);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
        temp.connect(headers, onConnect, onError);
    };

    const onConnect = () => {

        console.log("I have connected", stompClient)

        // Subscribe to the current chat messages based on the chat type
        if (stompClient) {
            // if (currentChat.isGroupChat) {
            // // Subscribe to group chat messages
            // stompClient.subscribe(`/group/${currentChat?.id}`, onMessageReceive);
            // } else {
            // Subscribe to direct user messages
            stompClient.subscribe(`/user/${chatId}`, onMessageReceive);
            // }
        }
    };

    const onError = (error) => {
        console.log("on error ", error);
    };    

    useEffect(() => {
        if (stompClient && stompClient.connected) {
        //   const subscription = currentChat.isGroupChat
        //     ? stompClient.subscribe(`/group/${currentChat.id}`, onMessageReceive)
        //     : 
        const subscription = stompClient.subscribe(`/app/message`, onMessageReceive);
    
          return () => {
            subscription.unsubscribe();
          };
        }
      }, [stompClient, chatId]);

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

        if (stompClient && stompClient.connected) { // Ensure connection is established
            stompClient.send(`/user/${chatId}`, {}, JSON.stringify({chatId, user: userName, text: content}));
            setContent('');
        } else {
            console.error("WebSocket connection is not established yet.");
        }
      };
      

      const onMessageReceive = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: receivedMessage.user, text: receivedMessage.text },
        ]);
      };

    
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/pingme/chats/${chatId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const history = await response.json();
        const messageHistory = history.messages.map((data) => ({
          user: data.user.name,
          text: data.content,
        }));
        setMessages(messageHistory);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();
  }, [chatId, token]);

  useEffect(() => {
    connect();

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

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