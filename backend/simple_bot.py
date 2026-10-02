import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph,START,END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage,HumanMessage,SystemMessage
from typing  import TypedDict,Annotated
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient
from lib.dbconfig import client
from langgraph.prebuilt import ToolNode,tools_condition
import requests
from lib.tool_demo import tools

load_dotenv()

groq_api_key = os.environ["GROQ_API_KEY"]


llm = ChatGroq(
                api_key=groq_api_key,
               model="openai/gpt-oss-120b",
               temperature=0
            )

llm_with_tools = llm.bind_tools(tools)

class ChatState(TypedDict) :

    messages : Annotated[list[BaseMessage],add_messages]


def chat(state: ChatState) :

    system_message = SystemMessage(
        content="""
You are an AI assistant with access to documents uploaded by the user.

IMPORTANT RULE:

If the user's request refers to, asks about, reviews, analyzes,
summarizes, compares, or gives an opinion about any document that
may have been uploaded in the current conversation, you MUST use
the get_data_from_rag tool before answering.

This includes indirect references such as:

- "these docs"
- "these files"
- "these PDFs"
- "my resume"
- "my resumes"
- "the documents I uploaded"
- "what do you think about this?"
- "review this"
- "analyze these"
- "how is my resume?"
- "what do you think about my resume?"
- "are these resumes good for software development?"
- "compare my two resumes"

Do not ask the user to paste the document if it has already
been uploaded.

Use the retrieved document content as the primary source for
your answer.

For questions unrelated to uploaded documents, answer normally
or use the appropriate available tools.
"""
    )

    messages = state["messages"]

    response = llm_with_tools.invoke([system_message]+messages)

    return {'messages':[response]}

tools_node = ToolNode(tools)
    

checkpoint = MongoDBSaver(client)
graph = StateGraph(ChatState)

#node

graph.add_node("chat",chat)
graph.add_node("tools",tools_node)

#edges

graph.add_edge(START,"chat")
graph.add_conditional_edges("chat",tools_condition)
graph.add_edge("tools","chat")


chat_flow = graph.compile(checkpointer=checkpoint)





