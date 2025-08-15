import { createContext, useContext, useState } from "react";

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    return (
        <AuthContext.Provider value={[authUser, setAuthUser]}>
        {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to access the context
export const useAuth = () => useContext(AuthContext);
