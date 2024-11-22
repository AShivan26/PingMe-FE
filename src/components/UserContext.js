import React, { createContext, useState } from 'react';

// Create a context with an initial value of null
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);


    return (
        <UserContext.Provider value={{ userId, setUserId, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};