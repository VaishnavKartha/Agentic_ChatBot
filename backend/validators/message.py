from pydantic import BaseModel,Field,field_validator

class Message(BaseModel) :

    message:str = Field(description="user message")

    