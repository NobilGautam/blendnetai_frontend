// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
    user_id: string;
    username: string;
}

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const setUserAndStore = (user: User | null) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
        setUser(user);
    };

    return (
        <UserContext.Provider value={{ user, setUser: setUserAndStore }}>
            {children}
        </UserContext.Provider>
    );
};
