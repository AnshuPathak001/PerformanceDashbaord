import asyncio
import re
import time
from playwright.async_api import Page

class OpenAirLoginPage:
    def __init__(self, page: Page, streamer=None):
        self.page = page
        self.streamer = streamer
        self.SSO_URL = "https://auth.netsuitesuiteprojectspro.com/login_sso"
        self.COMPANY_ID_INPUT = "input[name='companyID']"
        self.SIGN_IN_BUTTON = "input[type='submit']"
        self.MS_EMAIL_INPUT = "#i0116"
        self.MS_NEXT_BUTTON = "#idSIButton9"
        self.MS_PASSWORD_INPUT = "#passwordInput"
        self.VALTECH_SIGNIN_BUTTON =  "#submitButton"
        self.MFA_CODE_SELECTOR =  "#validEntropyNumber"

    async def goto(self):
        # print("🌐 Navigating to OpenAir SSO page...")
        await self.page.goto(self.SSO_URL)
        await self.page.wait_for_load_state("domcontentloaded")

    async def enter_company_id(self, company_id: str):
        print(f"🏢 Entering Company ID: {company_id}")
        html = await self.page.content()
        
        await self.page.wait_for_selector(self.COMPANY_ID_INPUT, timeout=10000)
        await self.page.fill(self.COMPANY_ID_INPUT, company_id)

    async def click_sign_in(self):
        print("➡️ Clicking 'Sign In' on OpenAir SSO...")
        await self.page.click(self.SIGN_IN_BUTTON)

    async def enter_ms_email(self, email):
        await self.page.wait_for_url(re.compile(r".*login\.microsoftonline\.com.*"), timeout=15000)
        await self.page.wait_for_selector(self.MS_EMAIL_INPUT, timeout=15000)
        await self.page.fill(self.MS_EMAIL_INPUT, email)

    async def click_ms_next(self):
        print("➡️ Clicking 'Next' on Microsoft login...")
        await self.page.click(self.MS_NEXT_BUTTON)

    async def enter_valtech_password(self, password: str):
        print("🔐 Entering Valtech Password...")
        await self.page.wait_for_selector(self.MS_PASSWORD_INPUT, timeout=10000)

        if password and password.strip() != "":
            await self.page.fill(self.MS_PASSWORD_INPUT, password)
            print("✅ Autofilled password.")
            return

        print("⌛ Waiting for user to manually enter password...")
        
        start_time = time.time()
        timeout = 30
        
        while time.time() - start_time < timeout:
            try:
                # Check if password field has value
                password_value = await self.page.input_value(self.MS_PASSWORD_INPUT)
                if password_value and len(password_value.strip()) > 0:
                    print("✅ User entered password manually.")
                    return
            except:
                pass
            
            await self.page.wait_for_timeout(1000)  # Wait 1 second before checking again
        
        print("❌ Timeout: User did not enter password in 30 seconds.")
        raise Exception("User didn't enter password in time.")

    async def click_valtech_sign_in(self):
        print("➡️ Clicking 'Sign In' on Valtech login...")
        # await self.page.click(self.VALTECH_SIGNIN_BUTTON)

    async def get_mfa_code(self):
        print("📱 Waiting for MFA Code on screen...")
        try:
            await self.page.wait_for_selector(self.MFA_CODE_SELECTOR, timeout=15000)
            mfa_element = await self.page.query_selector(self.MFA_CODE_SELECTOR)
            code = await mfa_element.inner_text() if mfa_element else "N/A"
            code = code.strip()

            print(f"\n🔑 MFA Code displayed on screen: {code}")
        
        # Stream to frontend
            if self.streamer:
                self.streamer(f"2FA: {code}")

            return code
        except:
            print("⚠️ MFA code not found (may be skipped or redirected).")
            return "N/A"
