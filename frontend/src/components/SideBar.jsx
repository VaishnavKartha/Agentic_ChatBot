import { SquarePen } from 'lucide-react'
import React, { useContext } from 'react'
import { MessageContext } from '../context/ChatContext'
import { useNavigate } from 'react-router-dom';

const SideBar = () => {

  const {chatHistory} = useContext(MessageContext);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='p-2 mb-2 mx-auto'>
        <h1 className='text-3xl'>Assistant</h1>
      </div>

      <div className='flex-1 overflow-y-auto'>


        <div className='flex justify-center items-center gap-2 mb-8 cursor-pointer' onClick={()=>navigate("/chat")}>
          <span>New Chat</span>
          <span className=''><SquarePen size={"18px"}/></span>
        </div>

        <div className=' flex flex-col gap-2'>

          {chatHistory?.length > 0 && chatHistory.map((chat)=>{
            return <div key={chat.thread_id} 
            className='min-w-0 bg-zinc-600/40 rounded-xl p-2 m-2 cursor-pointer truncate'
            onClick={()=>navigate(`/chat/${chat.thread_id}`)}>
              {chat.title || chat.thread_id}
              </div>
          })}

          
        </div>

      </div>

      <div className='p-2 mt-2 mx-auto'>

        <button>Logout</button>

      </div>



    </div>
  )
}

export default SideBar
