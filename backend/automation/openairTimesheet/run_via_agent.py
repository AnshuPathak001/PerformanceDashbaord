import asyncio
import subprocess
import platform
from pages.openair_login_page import OpenAirLoginPage
from pages.timesheet_page import TimesheetPage

try:
    from automation.openairTimesheet.agent_main import call_llm_and_parse_statement
except ImportError:
    from agent_main import call_llm_and_parse_statement

from playwright.async_api import async_playwright

async def run_timesheet_bot(email, password, statement):
    yield "Starting automation..."
    
    try:
        async with async_playwright() as p:
            browser_type = await detect_user_browser()
            yield f"Detected browser: {browser_type}"
            
            browser_engines = {
                "chromium": p.chromium,
                "firefox": p.firefox,
                "webkit": p.webkit
            }
            
            browser_engine = browser_engines.get(browser_type, p.chromium)
            
            try:
                browser = await browser_engine.launch(headless=False)
                yield f"Launched {browser_type} successfully"
            except Exception:
                yield f"Failed to launch {browser_type}, falling back to chromium"
                browser = await p.chromium.launch(headless=False)

            context = await browser.new_context()
            page = await context.new_page()

            login = OpenAirLoginPage(page)
            await login.goto()
            yield "Navigated to login page"

            await login.enter_company_id("Valtech")
            await login.click_sign_in()
            await login.enter_ms_email(email)
            await login.click_ms_next()
            await login.enter_valtech_password(password)
            await login.click_valtech_sign_in()

            yield "Logged in. Waiting for 2FA..."

            mfa_code = await login.get_mfa_code()

            if mfa_code == "N/A":
                yield "2FA: N/A"
                yield "Password or 2FA code not available"
                await context.close()
                await browser.close()
                return
            else:
                yield f"2FA: {mfa_code}"

            await page.wait_for_timeout(15000)

            ts = TimesheetPage(page)
            await ts.goto_timesheets()

            try:
                await ts.open_latest_timesheet()
                yield "Opening existing timesheet..."
                user_mode = "update"

                async for msg in ts.delete_all_rows():
                    yield msg

                await ts.goto_timesheets()
                await ts.open_latest_timesheet()

            except Exception:
                yield "No open timesheet found. Creating new..."
                try:
                    await ts.create_new_timesheet()
                    user_mode = "create"
                except Exception as e:
                    yield f"Timesheet creation failed: {str(e)}"
                    await context.close()
                    await browser.close()
                    return

            available_options = await ts.get_all_project_task_options()
            yield "Understanding your statement..."

            try:
                action_llm, params, user_mode = call_llm_and_parse_statement(statement, available_options, user_mode)
            except Exception as e:
                yield f"LLM parsing error: {str(e)}"
                await context.close()
                await browser.close()
                return

            yield f"Parsed {len(params)} entries from LLM output."

            if action_llm != "fill_timesheet":
                yield "LLM did not return a fill_timesheet action"
                await context.close()
                await browser.close()
                return

            yield "Filling timesheet..."
           
            try:
                if user_mode == "create":
                    await ts.fill_multiple_timesheets_on_opened_page(params)
                else:
                    await ts.fill_multiple_timesheets(params)
            except Exception as e:
                yield f"Error while filling timesheet: {str(e)}"
                await context.close()
                await browser.close()
                return

            if await ts.is_submission_successful():
                yield "Timesheet submitted successfully."
            else:
                yield "Submission may need manual check."

            await context.close()
            await browser.close()
            yield "Automation completed successfully!"

    except Exception as e:
        yield f"Unexpected error: {str(e)}"

async def detect_user_browser():
    """Detect user's default browser"""
    system = platform.system()
    
    try:
        if system == "Windows":
            result = subprocess.run([
                "reg", "query", 
                "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
                "/v", "ProgId"
            ], capture_output=True, text=True)
            
            if "ChromeHTML" in result.stdout:
                return "chromium"
            elif "FirefoxURL" in result.stdout:
                return "firefox"
            elif "MSEdgeHTM" in result.stdout:
                return "chromium"
                
        elif system == "Darwin":
            result = subprocess.run([
                "defaults", "read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"
            ], capture_output=True, text=True)
            
            if "chrome" in result.stdout.lower():
                return "chromium"
            elif "firefox" in result.stdout.lower():
                return "firefox"
            elif "safari" in result.stdout.lower():
                return "webkit"
                
        elif system == "Linux":
            result = subprocess.run([
                "xdg-settings", "get", "default-web-browser"
            ], capture_output=True, text=True)
            
            if "chrome" in result.stdout.lower() or "chromium" in result.stdout.lower():
                return "chromium"
            elif "firefox" in result.stdout.lower():
                return "firefox"
                
    except Exception as e:
        print(f"Could not detect browser: {e}")
    
    return "chromium"
