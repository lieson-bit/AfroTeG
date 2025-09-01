import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState('/logo.png');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                if (data.user.profilePic) {
                    setProfilePic(data.user.profilePic);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const login = async (user, token) => {
        localStorage.setItem("token", token); // Store the token in local storage
        setUser(user); // Update the user state
        setProfilePic(user.profilePic || "logo.png"); // Update the profile picture
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfilePic('/logo.png');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, setProfilePic ,profilePic, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);