import sys
import asyncio
from run_via_agent import run_timesheet_bot


async def main():
    if len(sys.argv) != 4:
        print("Usage: python run_automation.py <email> <password> <statement>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]
    statement = sys.argv[3]

    try:
        
        async for message in run_timesheet_bot(email, password, statement):
            print(message, flush=True)# flush=True ensures immediate output
    except Exception as e:
        print(f"ERROR: {str(e)}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())

