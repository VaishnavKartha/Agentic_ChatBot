import React from 'react'
import axiosInstance from '../lib/axiosSetup'

const useChat = () => {

    async function generateUuid(){
        try {
            const {data} = await axiosInstance.post("/chat/new");
            return data.message
        } catch (error) {
            throw new Error(error)
        }
    }

    async function getReply(id,formData) {
        try {
            const {data} = await axiosInstance.post(`/chat/${id}`,formData)
            //console.log(data)
            return data.message
        } catch (error) {
            console.log(error)

            throw new Error(error)
        }

    }

    async function getAllConversations(){
        try {
            const {data} = await axiosInstance.get("/chat")
            return data.chats
        } catch (error) {
            throw new Error(error.message)
        }
    }

  return {generateUuid, getReply,getAllConversations}
}

export default useChat
