import React, { useState } from 'react'
import Prompt from './Prompt'
import Sidebar from './Sidebar'

function Home() {
    return (
        <div className='flex h-screen bg-white text-black'>

            {/* sidebar */}
            <div className='w-64 bg-[#f9fbff]'><Sidebar/></div>

            {/* prompt */}
            <div className='flex-1 flex flex-col w-full'>
                <div className='flex-1 flex justify-center items-center px-6'>
                    <Prompt/>
                </div>
                
            </div>
        </div>
    )
}

export default Home