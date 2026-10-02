from fastapi import APIRouter,HTTPException,UploadFile,File,Form
from fastapi.responses import JSONResponse
from simple_bot import chat_flow
from validators.message import Message
from langchain_core.messages import HumanMessage
import json
from lib.generate_uuid import generate_uuid
from lib.dbconfig import conversations
from models.chat_model import Conversation
from pathlib import Path
from lib.rag import add_document_to_vectordb



chat_route = APIRouter(prefix="/api/chat")

@chat_route.post("/new")
def create_new_chat() :
    try :

        thread_id = generate_uuid()

        conversation= Conversation(thread_id=thread_id)

        conversations.insert_one(conversation.model_dump())

        return JSONResponse(
            status_code=200,
            content={"message":thread_id}
        )
    except Exception as e :
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    

@chat_route.get("/")
def get_all_conversations() :

    try :

        convs = list(conversations.find({},{"_id":0}))
        print(convs)

        return JSONResponse(
            status_code=200,
            content={"chats":convs}
        )

    except Exception as e :

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@chat_route.post("/{thread_id}")
async def reply(thread_id:str,message:str=Form(""),files:list[UploadFile] | None=File(None)) :

    
    config = {'configurable':{"thread_id":thread_id}}

    try :


        user_message = message.strip()

        if not files and not user_message :
            raise HTTPException(status_code=400,detail="Empty request")


        if files :
            print(len(files))
            for file in files :

                upload_dir = Path.cwd() / "documents" / f"{thread_id}"
                upload_dir.mkdir(parents=True,exist_ok=True)
            
                file_path = upload_dir / file.filename
                with open(file_path,"wb") as f :
                    f.write(await file.read())
            
                res = add_document_to_vectordb(file_path,thread_id)

                if res["message"] != "success" :

                    return JSONResponse(status_code=400,content={"message":f"Error occurred while uploading file : {file.filename}"})

        
        if user_message :
            res = chat_flow.invoke({'messages':[HumanMessage(content=user_message.strip())]},config=config)
            return JSONResponse(status_code=200,content={"message":res["messages"][-1].content})

        return {
        "message": "Files uploaded successfully",
        "files": [
                file.filename
                for file in files
            ]
        }

        
    except HTTPException :
        raise

    except Exception as e  :
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



@chat_route.get("/{thread_id}")
def load_chat(thread_id:str) :

    config = {"configurable":{"thread_id":thread_id}}
    state = chat_flow.get_state(config)

    messages = state.values.get("messages",[])
    history=[]
    for msg in messages :

       if msg.type == 'tool' :
           continue

       if msg.type == 'ai' and not msg.content :
           continue
       
       history.append({"type":msg.type,"message":msg.content})

    

    return JSONResponse(
        status_code=200,
        content={"messages":history}
    )

   

  


