import React, { useEffect } from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import ChatContext from '../context/ChatContext'

const Layout = () => {

    
  return (

    <ChatContext>

        <div className='flex h-screen'>

            <aside className='border-0 border-r sm:w-[20%] h-screen'>
                <SideBar/>
            </aside>

            <main className='relative flex-1 flex h-screen'>
                <Outlet/>
            </main>
        
        </div>
    </ChatContext>
  )
}

export default Layout
