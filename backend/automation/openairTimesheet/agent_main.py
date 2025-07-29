import os
import json
import getpass
from dotenv import load_dotenv
from openai import OpenAI
from pprint import pprint
from typing import Tuple, List, Dict, Union

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# CLI helper if using script directly (not via API)
def get_user_input_bundle() -> Tuple[str, str, str, str]:
    print("Enter your Microsoft Email:", end=" ")
    email = input().strip()
    password = getpass.getpass("Enter your Microsoft Password (input hidden): ")

    print("\nTimesheet Action Options")
    mode = input(" Do you want to create or update? (create/update): ").strip().lower()

    if mode not in ["create", "update"]:
        print("\nInvalid input. Only 'create' or 'update' supported.")
        exit(0)

    print("\nPlease describe your weekly work in natural language.")
    print("Example:")
    print("  I worked on two projects. On AI CoE for development on Monday and Tuesday, 8 hours each.")
    print("  Then I worked on the sustainability project for 8 hours on Thursday and Wednesday.")
    print("  Also on Friday I worked on Non-billable activity project on Onboarding task for 8 hours.\n")

    user_query = input("\nYour timesheet input: ").strip()

    if user_query.lower() in ["login only", "just login"]:
        return email, password, user_query, mode

    return email, password, user_query, mode


def call_llm_and_parse_statement(
    statement: str,
    available_options: Dict[str, List[str]],
    mode: str
) -> Tuple[str, List[Dict[str, Union[str, Dict[str, str]]]], str]:
    """
    Parses the user's natural language statement into structured timesheet data using OpenAI.
    Returns (action, params, mode)
    """

    project_task_str = "\n".join([
        f"- {project} → {', '.join(tasks)}" for project, tasks in available_options.items()
    ])

    system_prompt = f"""
You are a helpful assistant extracting timesheet data from user input.
Return ONLY valid JSON in this format:

{{
  "action": "fill_timesheet",
  "params": [
    {{
      "project_label": "...",
      "task_label": "...",
      "custom_hours": {{"Monday": "8", ...}},
      "notes": "Worked on this activity"
    }}
  ]
}}

Rules:
- Use only this list of project-task options:
{project_task_str}
- Match project and task using fuzzy or partial matching
- If no exact task found, use the closest one; if no closest task found, use the second task from the list
- All 7 weekdays must appear in custom_hours (fill 8 hours only where mentioned; for Saturday and Sunday fill 0 hours with no description)
- If no description provided, default note = "Worked on this activity"
- Do not assume a day is worked unless explicitly stated
- Only output raw JSON, no markdown, no comments
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # or "gpt-4", "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": statement}
            ],
            temperature=0.0,
        )
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

    raw_json = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(raw_json)
    except json.JSONDecodeError:
        raise Exception("Failed to parse LLM response. Try rephrasing your input.")

    if parsed.get("action") != "fill_timesheet" or "params" not in parsed:
        raise Exception("Invalid response from LLM. Missing required fields.")

    return parsed["action"], parsed["params"], mode
