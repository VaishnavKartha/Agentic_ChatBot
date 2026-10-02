from pydantic import BaseModel

class Conversation(BaseModel) :
    thread_id:str
    title:str=None
    user_id:str=None