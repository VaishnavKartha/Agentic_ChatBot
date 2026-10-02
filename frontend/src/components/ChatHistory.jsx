import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
const ChatHistory = ({history=[]}) => {
  return (

    <div className='w-full flex flex-col items-end gap-2 mb-12 '>
        {history.length > 0 && history.map((msg)=>{
            if(msg.type == "human"){
                return <div className='rounded-md max-w-[40%] bg-blue-600/70 p-2 '>{msg.message}</div>
            }

            return <div className='px-8 max-w-full wrap-break-word '>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                        >
                            {msg.message}
                        </ReactMarkdown>
                </div>
        })}
    </div>
  )
}

export default ChatHistory
