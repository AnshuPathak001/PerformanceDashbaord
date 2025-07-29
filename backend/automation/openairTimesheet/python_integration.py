import sys
import json
import asyncio
import traceback
import os

sys.stdout.flush()

# Force unbuffered output immediately
try:
    sys.stdout.reconfigure(line_buffering=True)
    sys.stderr.reconfigure(line_buffering=True)
    print("DEBUG: Reconfigured stdout", flush=True)
except Exception as e:
    print(f"DEBUG: Reconfigure failed: {e}", flush=True)

# Get directories
current_dir = os.path.dirname(os.path.abspath(__file__))
automation_dir = os.path.dirname(current_dir)
backend_root = os.path.dirname(automation_dir)

# Add paths to sys.path
paths_to_add = [backend_root, automation_dir, current_dir]
for path in paths_to_add:
    if path not in sys.path:
        sys.path.insert(0, path)

def log_status(message):
    """Print with immediate flushing for real-time updates"""
    print(message, flush=True)
    sys.stdout.flush()
    import time
    time.sleep(0.1)

async def main():
    try:
        log_status("Loading dependencies...")

        # Check command line arguments
        print(f"DEBUG: sys.argv = {sys.argv}", flush=True)
        print(f"DEBUG: len(sys.argv) = {len(sys.argv)}", flush=True)

        if len(sys.argv) < 2:
            log_status("Missing required input")
            print("DEBUG: No command line argument provided", flush=True)
            sys.exit(1)

        raw_data = sys.argv[1]
        print(f"DEBUG: Raw input: {raw_data}", flush=True)

        try:
            data = json.loads(raw_data)
            print(f"DEBUG: JSON parsed successfully", flush=True)
        except json.JSONDecodeError as e:
            log_status(f"JSON decode error: {e}")
            print(f"DEBUG: JSON error: {e}", flush=True)
            sys.exit(1)

        email = data.get("email")
        password = data.get("password", "")
        statement = data.get("statement")

        print(f"DEBUG: Email: {email}", flush=True)
        print(f"DEBUG: Statement length: {len(statement) if statement else 0}", flush=True)

        if not email or not statement:
            log_status("Missing required input - email or statement is empty")
            print("DEBUG: Email or statement is empty", flush=True)
            sys.exit(1)

        try:
            agent_file = os.path.join(current_dir, 'run_via_agent.py')
            print(f"DEBUG: Looking for: {agent_file}", flush=True)
            print(f"DEBUG: File exists: {os.path.exists(agent_file)}", flush=True)

            files = os.listdir(current_dir)

            from run_via_agent import run_timesheet_bot
            print("DEBUG: Import successful", flush=True)

        except ImportError as e:
            log_status(f"Import error: {e}")
            print(f"DEBUG: Import error: {e}", flush=True)
            print(f"DEBUG: Full traceback: {traceback.format_exc()}", flush=True)
            sys.exit(1)

        message_count = 0
        try:
            generator = run_timesheet_bot(email, password, statement)

            async for message in generator:
                message_count += 1
                print(f"DEBUG: Got message {message_count}: {message}", flush=True)
                log_status(f"[{message_count}] {message}")
                await asyncio.sleep(0.2)

        except Exception as e:
            log_status(f"Error in automation: {str(e)}")
            print(f"DEBUG: Generator error: {str(e)}", flush=True)
            print(f"DEBUG: Full traceback: {traceback.format_exc()}", flush=True)
            raise

        print(f"DEBUG: Completed with {message_count} messages", flush=True)

    except Exception as e:
        log_status(f"Unexpected error: {str(e)}")
        print(f"DEBUG: Main error: {str(e)}", flush=True)
        print(f"DEBUG: Full traceback: {traceback.format_exc()}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    import io
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, line_buffering=True)
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, line_buffering=True)
        print("DEBUG: TextIOWrapper applied", flush=True)
    except Exception as e:
        print(f"DEBUG: TextIOWrapper failed: {e}", flush=True)

    asyncio.run(main())
