from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from mcp_use import MCPAgent, MCPClient
from langchain_openai import ChatOpenAI
import asyncio
import os
import json
import tempfile

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    token: str = ""  # optional token

@app.post("/ask")
async def ask_question(req: QueryRequest):
    base_dir = os.path.dirname(__file__)
    config_path = os.path.join(base_dir, "github_mcp.json")

    # Load and modify config dynamically
    with open(config_path, "r") as f:
        config_data = json.load(f)

    if req.token:
        config_data["mcpServers"]["github"]["env"]["GITHUB_PERSONAL_ACCESS_TOKEN"] = req.token

    # Save to a temporary config file for safe parallel calls
    with tempfile.NamedTemporaryFile(mode="w+", delete=False, suffix=".json") as temp_config:
        json.dump(config_data, temp_config)
        temp_config_path = temp_config.name

    # Load MCP client from modified config
    client = MCPClient.from_config_file(temp_config_path)

    llm = ChatOpenAI(model="gpt-4o")
    agent = MCPAgent(llm=llm, client=client, max_steps=30)

    result = await agent.run(req.query)
    return {"result": result}
