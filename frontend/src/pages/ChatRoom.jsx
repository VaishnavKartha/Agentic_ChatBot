import React, { useContext, useEffect, useRef, useState } from 'react'
import SideBar from '../components/SideBar'
import {Plus, Send} from 'lucide-react'
import Loader from '../components/Loader';
import useChat from '../hooks/useChat';
import ChatHistory from '../components/ChatHistory';
import { MessageContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';
import axiosInstance from '../lib/axiosSetup';
const ChatRoom = () => {
    const [isReplying,setIsReplying] = useState(false);
    const [userMessage,setUserMessage] = useState("");
    const [messageHistory,setMessageHistory] = useState([]);
    const {getReply} = useChat();
    const {id} = useParams();
    const fileInputRef = useRef(null);
    const [selectedFiles,setSelectedFiles] = useState([]);
    const textAreaRef = useRef(null);

    const {message,setMessage} = useContext(MessageContext);

    useEffect(()=>{
        const loadHistory=async()=>{
            try {
                const {data} = await axiosInstance.get(`/chat/${id}`);
                setMessageHistory(data.messages);
                
            } catch (error) {
                console.log(error.message)
            }   
        }

        loadHistory()
    },[id])

    useEffect(()=>{
        if(!message.trim()) return

        setUserMessage(message.trim());
        setMessage("");

        sendMessage()
    },[])

    const handleHeight=()=>{
        const textarea = textAreaRef.current;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight,250)}px` ;
    }

    const handleFileUpload=(e)=>{
        const files = Array.from(e.target.files)

        if(!files.length) return

        setSelectedFiles((prev)=>{
            const combinedFiles = [...files,...prev]

            if(combinedFiles.length > 3){
                console.log("Max file upload limit is 3")
                return prev
            }

            return combinedFiles
        })

       


    }

    console.log(selectedFiles)


    const sendMessage=async()=>{

        if(!userMessage.trim() && !selectedFiles?.length) return

        const formData = new FormData();

        const message = userMessage.trim();
        formData.append("message",message);
        setUserMessage("")

        const prevHistory = messageHistory;

        if(selectedFiles){

            selectedFiles.forEach((file)=>{
                formData.append("files",file)
            })
        }

        try {
            setIsReplying(true)
            setMessageHistory((prev)=>[...prev,{type:"human",message}])
           const reply =  await getReply(id,formData);

           setSelectedFiles([]);
           setMessageHistory((prev)=>[...prev,{type:"ai",message:reply}])
            
        } catch (error) {

            setMessageHistory(prevHistory)

        }finally{
            setIsReplying(false)

        }   



    }


  return (
    

        <div className='relative flex-1'>

            <div className='h-screen ml-auto mb-20 overflow-y-auto'>
                    
                    <ChatHistory history={messageHistory}/>
            </div>


            <div className='z-50 absolute bottom-0 w-full flex justify-center py-2 px-1 bg-[#1F1F1F]'>

                <div className={`w-[70%] flex justify-center  ${(userMessage.trim() || selectedFiles.length > 0) ? "items-end":"items-center"} gap-2`}>

                    <div className='cursor-pointer relative'>
                        <input
                        ref={fileInputRef}
                        className='border z-50 absolute hidden'
                        type='file'
                        multiple
                        accept='.pdf'
                        onChange={handleFileUpload}/>
                        <button className='cursor-pointer' onClick={()=>fileInputRef.current.click()}><Plus/></button>
                    </div>
                    
                    <textarea
                        className='rounded-2xl outline outline-zinc-600 p-2 resize-none overflow-y-auto focus:outline-zinc-800/60 text-sm flex-1 bg-zinc-800'
                        placeholder='Type your message here....'
                        value={userMessage}
                        ref={textAreaRef}
                        onInput={handleHeight}
                        onChange={(e)=>setUserMessage(e.target.value)}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter" && !isReplying){
                                sendMessage()
                            }
                        }}
                    />

                    <button
                        className='cursor-pointer'
                        disabled={isReplying}
                        onClick={sendMessage}
                       
                    >
                        {!isReplying ? <Send size={"20px"}/> : <Loader/>}
                    </button>

                </div>


            </div>

        </div>
        

   
  )
}

export default ChatRoom
