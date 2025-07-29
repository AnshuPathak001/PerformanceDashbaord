# backend/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from mcp_use import MCPAgent, MCPClient
from langchain_openai import ChatOpenAI
import asyncio
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask_question(req: QueryRequest):

    base_dir = os.path.dirname(__file__)  # This will be src/github/
    config_path = os.path.join(base_dir, "github_mcp.json")
    client = MCPClient.from_config_file(config_path)

    llm = ChatOpenAI(model="gpt-4o")
    agent = MCPAgent(llm=llm, client=client, max_steps=30)

    result = await agent.run(req.query)
    return {"result": result}

