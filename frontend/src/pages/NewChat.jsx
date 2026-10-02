import { Plus, Send } from 'lucide-react'
import React, { useContext, useRef, useState } from 'react'
import useChat from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { MessageContext } from '../context/ChatContext';

const NewChat = () => {

    const textRef = useRef(null);
    const {message,setMessage,setChatHistory} = useContext(MessageContext);
    const {generateUuid} = useChat();
    

    const navigate = useNavigate();


    const handleInput=()=>{
        const textarea = textRef.current;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    }

    const startChat=async ()=>{

        try {
            const uuid = await generateUuid();
            
            setChatHistory(prev=>[...prev,{thread_id:uuid,title:message.slice(0,40)}])
            navigate(`/chat/${uuid}`)

        } catch (error) {
            console.log(error.message)
        }

    }


  return (
    <div className='w-full flex justify-center items-center'>
      <div className='min-w-[70%]'>


        <div className='text-center mb-12'>
            <h1 className='text-3xl'>
                New Chat
            </h1>
        </div>

        <div className={`bg-zinc-900 rounded-xl p-4 flex gap-2 ${!message.trim() ? "items-center" :"items-end"} `}>

            <div>
                <Plus/>
            </div>

            
            <textarea
                ref = {textRef} 
                onInput={handleInput}
                className='flex-1 p-2 outline-0 rounded-xl resize-none max-h-40 overflow-y-auto'
                placeholder='What are you thinking ?'
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
            />

            <div
                onClick={startChat}
            >
                <Send/>
            </div>
        </div>


      </div>
    </div>
  )
}

export default NewChat
