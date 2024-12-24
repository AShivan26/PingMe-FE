import React, {useContext, useEffect, useState} from 'react';
import './UserList.css';
import {UserContext} from "./UserContext"; // Ensure you have the appropriate styles

const UserList = ({ userId, onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const { token} = useContext(UserContext);
    const [error, setError] = useState(null);
    const [isPolling] = useState(true); // State to control polling

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log(token);
                const response = await fetch(`http://localhost:8080/pingme/chats/users`, {
                    method: 'GET', // or GET depending on your API
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Check if the response is in JSON format
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Expected JSON response');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching users:', error);
            }
        };

        // Initial fetch
        fetchUsers();

        // Set up polling
        const interval = setInterval(() => {
            if (isPolling) {
                fetchUsers();
            }
        }, 3000); // Poll every 5 seconds

        // Clean up interval on component unmount
        return () => {
            clearInterval(interval);
        };
    }, [userId, isPolling, token]);

    return (
        <div className="user-list">
            <h3>Online Users</h3>
            {error && <div className="error">Error: {error}</div>}
            <ul>
                {users.length > 0 ? (
                    users.map(user => (
                        <li
                            key={user.id}
                            className={`user-item ${user.online ? 'online' : 'offline'}`}
                            onClick={() => onUserSelect(user.id)}
                        >
                            {user.name}
                        </li>
                    ))
                ) : (
                    <li>No users available</li>
                )}
            </ul>
        </div>
    );
};

export default UserList;
