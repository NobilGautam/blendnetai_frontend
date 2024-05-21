// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext, User } from '../utils/UserContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:4000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/login/`, { username, password });
            const { token, user } = response.data; // assuming the response contains both token and user data
            const newUser: User = {
                user_id: token,
                username: user.username // assuming the user object has a username property
            };
            setUser(newUser);
            localStorage.setItem('token', token); // Assuming you want to store the token in localStorage
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to log in');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/register')}>Register</button>
        </div>
    );
};

export default Login;
