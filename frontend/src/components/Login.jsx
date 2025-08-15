import { Link, Navigate, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthProvider.jsx';

function Login() {
        
        const [,setAuthUser]=useAuth()
        const [error,setError]=useState('');

        const [formData,setformData]=useState({
            email:'',
            password:''
        });

        const navigate=useNavigate()
        
        const handleChange=(e)=>{
            const value=e.target.value
            const name=e.target.name

            setformData({
                ...formData,
                [name]:value
            })    
        }

        const handleLogin= async ()=>{
            setError("")
            try {
                const {data}= await axios.post("https://deepseek-backend-2qlp.onrender.com/api/v1/user/login",
                    {
                    email:formData.email,
                    password:formData.password},

                    {   
                        withCredentials:true
                    }
                );
                alert(data.message || "Login success");
                console.log(data);
                
                localStorage.setItem("user",JSON.stringify(data.user));
                localStorage.setItem("token",data.token)
                setAuthUser(data.token)
                navigate("/login")
            } catch (error) {
                const msg=error?.response?.data?.errors || "Login failed";
                setError(msg)
            }
            
        }

    return (
        <>
        <div className='h-screen flex justify-center items-center'>
            <div className='border-2 border-gray-100 p-4 max-w-sm rounded-3xl space-y-3 shadow-lg'>
                <div className='flex justify-center mb-2 mt-4 font-semibold '>Login</div>
                <div className='space-y-4'>
                    <input type="text" 
                    placeholder='Email address / Phone' 
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='border-2 border-gray-300 focus:border-gray-400 outline-none w-full p-2 rounded-lg'/>
                    
                    <input type="password" 
                    placeholder='Password' 
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    
                    className='border-2 border-gray-300 focus:border-gray-400 outline-none w-full p-2 rounded-lg'/>
                    
                    {/* error */}
                    {error && <span className='text-sm text-red-500'>{error}</span>}

                    <div className='text-sm text-gray-700'>By signing up or signing up, you consent to DeepSeek's
                        <span className='font-semibold underline text-black'> Terms of Use</span>  and 
                        <span className='font-semibold underline text-black'> Privacy Policy.</span> 
                    </div>
                    <button onClick={handleLogin}
                    
                    className='bg-blue-600 text-white font-bold w-full p-2.5 
                    cursor-pointer rounded-lg hover:bg-blue-700 transion duration-300'>Login</button>
                </div>
                <div className='flex flex-row justify-between mb-5'>
                    <div className='cursor-pointer text-sm font-semibold text-blue-600 '>Forgot Password? </div>
                    <Link to='/signup' className='cursor-pointer text-sm font-semibold text-blue-600 '>Sign up</Link>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default Login