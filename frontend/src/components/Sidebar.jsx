import React from 'react'
import { History, LogOut, X } from 'lucide-react'
import { useAuth } from '../../context/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

function Sidebar() {

    const [,setAuthUser]=useAuth();
    const user=JSON.parse(localStorage.getItem("user"));
    const navigate=useNavigate();

    const promptHistory = JSON.parse(localStorage.getItem(`PromptHistory_${user._id}`));

    const userHistory = (promptHistory || []).filter(item => item.role === "user").map(item => item.content);

    const handleLogout=()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthUser(null);
        navigate("/login");
        alert("Logout Successfully");
    }

    const handleNewchat=()=>{
        localStorage.removeItem(`PromptHistory_${user._id}`);
        window.location.reload();
    }
    
    return (
        <>
        <div className='flex flex-col h-full text-black'>
            {/* header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-300'>  
                <div className='text-2xl font-bold'>DeepSeek</div>
                <button className='w-6 h-6 cursor-pointer text-gray-300 hover:text-gray-500'><X/></button>
            </div>

            {/* History */}
            <div className='flex-1 flex-col overflow-y-auto px-4 py-3'>
                <button onClick={handleNewchat} className='w-full bg-[#dbeafe] cursor-pointer p-2 
                rounded-lg text-blue-500 font-bold hover:bg-blue-200
                hover:text-blue-600 mb-3 duration-300 transition'>New Chat</button>

                <h2 className="flex text-gray-700 font-semibold mb-3 justify-center"><History className=' h-5 w-5'/></h2>
                {userHistory &&
                <div className="space-y-2">
                    {userHistory.map((msg, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-2 rounded-lg text-sm text-gray-800 hover:bg-gray-200 cursor-pointer">
                            {msg}
                        </div>
                    ))}
                </div>
                }
                
    
            </div>

            {/* footer */}
            <div className='flex flex-col border-t border-gray-300 p-4'>
                <div className='flex items-center mb-3 cursor-pointer'>
                    <img className='rounded-full h-8 w-8' src="user.png" alt="profile" />
                    <span className='text-gray-700 ml-2'> {user? user.userName:"My Profile"}</span>
                </div>
                <button onClick={handleLogout}  className='flex p-2 w-full bg-[#dbeafe] 
                cursor-pointer rounded-lg text-blue-500 hover:bg-blue-200 
                hover:text-blue-600 duration-300 transition'><LogOut className='h-6 w-6 mr-2'/> Logout</button>
            </div>

        </div>
        
        </>
    )
}

export default Sidebar