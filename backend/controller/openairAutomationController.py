from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio

from automation.openairTimesheet.run_via_agent import run_timesheet_bot

router = APIRouter()

@router.post("/openair/fill-timesheet-stream")
async def stream_timesheet(data: dict):
    email = data["email"]
    password = data["password"]
    statement = data["statement"]
    # mode = data["mode"] 

    if not email or not statement:
        return StreamingResponse(iter(["data: ❌ Missing required input\n\n"]), media_type="text/event-stream")


    async def event_stream():
        yield "data: 🔌 Stream started\n\n"
        async for message in run_timesheet_bot(email, password, statement): 
            yield f"data: {message}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
