import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:4000/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}api/register`, { username, password });
      navigate('/login');
    } catch (error) {
      setError('Failed to register');
    }
  };

  return (
    <div className='bg-[#0e0f1b] h-[100vh] flex justify-center items-center'>
      <div className='w-[40%] p-5 h-fit rounded-3xl bg-[#243070]'>
        <h2 className=' font-bold text-[#ffffff] text-[2.5rem]'>Sign Up</h2>
        <p className='font-light text-[#ffffff] text-[1rem]'>Register to create an account</p>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col'>
              <input
                type="text"
                value={username}
                onChange={(e) => {setUsername(e.target.value);
                  console.log(username);
                }}
                placeholder="Username"
                className=' bg-transparent rounded-md border-2 border-[#ffffff] p-2 text-[#ffffff] my-3 font-light text-[1rem]'
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className=' bg-transparent rounded-md border-2 border-[#ffffff] p-2 text-[#ffffff] my-3 font-light text-[1rem]'
              />
              <button type="submit" className=' font-semibold text-[1.2rem] bg-transparent rounded-md p-2 text-[#ffffff] my-3 hover:bg-[#291f62] duration-300 px-4'>Sign Up</button>
          
        </form>
        <div className='flex flex-row'>
        <span className='font-light text-[1rem] text-[#ffffff]'>Already have an account? <button className='font-light text-[1rem] text-blue-300' onClick={() => navigate('/login')}>Login</button></span>
        
        </div>
      </div>
    </div>
  );
};

export default Register;
