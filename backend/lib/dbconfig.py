from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGOURI"))

db = client["chatbot"]

conversations = db["conversations"]


