import os
from dotenv import load_dotenv
from langchain_tavily import TavilySearch
from langgraph.graph import StateGraph,START,END
from langgraph.prebuilt import ToolNode,tools_condition
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from lib.rag import retriever
import requests
import math
from langchain_core.runnables import RunnableConfig


load_dotenv()




search_tool = TavilySearch(
    max_results=5,
    topic="general",
    search_depth="advanced"
)


@tool
def get_stock_price(symbol:str)-> dict :
    """
        Fetch latest stock price for a given symbol (e.g 'APPL', 'TSLA')
        using Alpha Vantage with API key in the URL.
     """
    try:
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={os.getenv('VANTAGE_API_KEY')}"
        r = requests.get(url).json()
        quote = r.get("Global Quote",{})
        #print(quote)
        return quote

    except Exception as e :
        raise Exception(e)

@tool
def get_current_weather(city:str)->dict:

    """
        Fetches the current weather information for the given city.
        
    """
    req_uri = f"https://api.weatherapi.com/v1/current.json?key={os.getenv('WEATHER_API')}&q={city}&aqi=no"

    result = requests.get(req_uri,timeout=10).json()

    return result["current"] or {"message":"Weather data not available"}


@tool
def get_data_from_rag(
    query: str,
    config: RunnableConfig
) -> str:
    """
    Search the documents uploaded in the current conversation.

    Use this tool when the user asks about the contents
    of an uploaded document.
    """

    thread_id = config["configurable"]["thread_id"]

    data = retriever.invoke(
        query,
        filter={"thread_id": thread_id}
    )

    print("Thread ID:", thread_id)
    print("Documents found:", len(data))

    if not data:
        return "No relevant information was found in the documents uploaded to this conversation."

    results = []

    for i, doc in enumerate(data, 1):
        results.append(
            f"Document chunk {i}:\n{doc.page_content}"
        )

    result = "\n\n".join(results)

    print(result)

    return result

   



     




tools = [search_tool,get_current_weather,get_stock_price,get_data_from_rag]

