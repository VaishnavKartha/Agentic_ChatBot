import React, { createContext, useEffect, useState } from 'react'
import useChat from '../hooks/useChat';
export const MessageContext = createContext();
const ChatContext = ({children}) => {
  const [message,setMessage] = useState("");
  const [chatHistory,setChatHistory] = useState([])

  const {getAllConversations} = useChat()

 useEffect(()=>{

  const getAll = async()=>{
    try {
      const chats = await getAllConversations()
  
      setChatHistory(chats)
      
    } catch (error) {

      console.log(error.message)
      
    }
  }

  getAll()

         
     },[])

  return <MessageContext.Provider value={{message,setMessage,chatHistory,setChatHistory}}> 

          {children} 

         </MessageContext.Provider>
}

export default ChatContext
