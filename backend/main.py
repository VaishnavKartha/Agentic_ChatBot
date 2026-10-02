from fastapi import  FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.chatRouter import chat_route


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

app.include_router(chat_route)
