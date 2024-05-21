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
    const BASE_URL = 'https://blendnetai-backend.onrender.com';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/login/`, { username, password });
            const { token, user } = response.data;
            const newUser: User = {
                user_id: token,
                username: user.username
            };
            setUser(newUser);
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to log in');
        }
    };

    return (
        <div className='bg-[#0e0f1b] h-[100vh] flex justify-center items-center'>
            <div className='w-[40%] p-5 h-fit rounded-3xl bg-[#243070]'>
                <h2 className='font-bold text-[#ffffff] text-[2.5rem]'>Login</h2>
                {error && <p className='text-red-500'>{error}</p>}
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className='bg-transparent rounded-md border-2 border-[#ffffff] p-2 text-[#ffffff] my-3 font-light text-[1rem]'
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className='bg-transparent rounded-md border-2 border-[#ffffff] p-2 text-[#ffffff] my-3 font-light text-[1rem]'
                    />
                    <button type="submit" className='font-semibold text-[1.2rem] bg-transparent rounded-md p-2 text-[#ffffff] my-3 hover:bg-[#291f62] duration-300 px-4'>Login</button>
                </form>
                <p className='text-[#ffffff] font-light text-[1rem]'>Don't have an account? <button className='font-light text-[1rem] text-blue-300' onClick={() => navigate('/register')}>Register</button></p>
            </div>
        </div>
    );
};

export default Login;
