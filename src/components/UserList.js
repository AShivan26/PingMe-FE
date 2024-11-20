import React, { useEffect, useState } from 'react';
import './UserList.css'; // Ensure you have the appropriate styles

const UserList = ({ userId, onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:8080/pingme/users/${userId}`);


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

        fetchUsers();
    }, [userId]);

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
                            onClick={() => onUserSelect(user)}
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
