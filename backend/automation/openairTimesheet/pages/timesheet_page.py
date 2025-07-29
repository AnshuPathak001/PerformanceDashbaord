import re
import time
import pprint
import asyncio
from datetime import datetime
from playwright.async_api import Page

class TimesheetPage:
    def __init__(self, page: Page):
        self.page = page

    async def goto_timesheets(self):
        print("Navigating to Timesheets > Open...")
        await self.page.wait_for_selector("text=Timesheets", timeout=60000)
        await self.page.get_by_role("link", name="Timesheets", exact=True).click()
        await self.page.get_by_role("link", name="Open", exact=True).first.click()

    async def open_latest_timesheet(self):
        print("Checking available timesheets...")
        today = datetime.today()
        today_str = today.strftime("%d-%m-%y")

        await self.page.wait_for_selector("role=link[name=/\\d{2}-\\d{2}-\\d{2} to \\d{2}-\\d{2}-\\d{2}/]", timeout=10000)
        locator = self.page.get_by_role("link", name=re.compile(r"\d{2}-\d{2}-\d{2} to \d{2}-\d{2}-\d{2}"))
        count = await locator.count()

        for i in range(count):
            text = await locator.nth(i).inner_text()
            match = re.match(r"(\d{2}-\d{2}-\d{2}) to (\d{2}-\d{2}-\d{2})", text)
            if match:
                start_str, end_str = match.groups()
                start_date = datetime.strptime(start_str, "%d-%m-%y")
                end_date = datetime.strptime(end_str, "%d-%m-%y")

                if start_date <= today <= end_date:
                    await locator.nth(i).click()
                    return

        print(f"No timesheet found for current date {today_str}")
        raise Exception("No current timesheet found")

    async def delete_all_rows(self):
        deleted_count = 0
        while True:
            try:
                await asyncio.sleep(3)
                delete_icons = await self.page.query_selector_all("a[aria-label='Delete row']")
                visible_count = 0
                for icon in delete_icons:
                    try:
                        if await icon.is_visible():
                            visible_count += 1
                    except Exception:
                        continue
                if visible_count == 0:
                    print("No more deletable rows found.")
                    break
                delete_button = await self.page.wait_for_selector("a[aria-label='Delete row']:visible", timeout=10000)
                await delete_button.click()
                confirm_button = await self.page.wait_for_selector("text=Delete", timeout=10000)
                await confirm_button.click()
                deleted_count += 1
                yield f"Removing incomplete & unfilled row {deleted_count}"
                await asyncio.sleep(4)
            except Exception as e:
                break

        try:
            await self.save_timesheet()
            yield "Timesheet saved after deletion."
        except Exception as e:
            print(f"Save failed after deletion: {e}")
            yield f"Save failed after deletion: {e}"

    async def create_new_timesheet(self):
        print("Creating new timesheet...")
        await self.page.get_by_role("link", name="Create").click()
        await self.page.get_by_placeholder("Search").click()
        await self.page.get_by_placeholder("Search").fill("Timesheets: Timesheet, New")
        await self.page.get_by_role("link", name="Timesheets: Timesheet, New", exact=True).click()
        await self.page.locator("#formButtonsBottom").get_by_role("button", name="Save").click()
        await self.page.wait_for_timeout(2000)

    async def get_all_project_task_options(self):
        available_options = {}
        await self.page.wait_for_selector("select[aria-label='Select Client : Project']", timeout=20000)
        dropdowns = self.page.locator("select[aria-label='Select Client : Project']")
        total = await dropdowns.count()

        for i in range(total):
            dropdown = dropdowns.nth(i)
            options = dropdown.locator("option")
            option_count = await options.count()

            for j in range(option_count):
                option = options.nth(j)
                project_text = (await option.inner_text()).strip()
                project_value = await option.get_attribute("value")

                if not project_text or project_value == "0":
                    continue

                await dropdown.select_option(value=project_value)

                task_dropdown = self.page.locator("select[aria-label='Select Task']").nth(i)
                await task_dropdown.wait_for(state="visible", timeout=10000)
                task_options = task_dropdown.locator("option")
                task_count = await task_options.count()

                tasks = []
                for k in range(task_count):
                    task = task_options.nth(k)
                    task_text = (await task.inner_text()).strip()
                    task_value = await task.get_attribute("value")

                    if task_text and task_value != "0":
                        tasks.append(task_text)

                available_options[project_text] = tasks

        return available_options

    async def fill_multiple_timesheets(self, timesheet_entries: list):
        await self.goto_timesheets()
        await self.open_latest_timesheet()
        await self.fill_rows(timesheet_entries)

    async def fill_multiple_timesheets_on_opened_page(self, timesheet_entries: list):
        await self.fill_rows(timesheet_entries)

    async def fill_rows(self, timesheet_entries: list):
        available = await self.get_all_project_task_options()
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        for i, entry in enumerate(timesheet_entries):
            project = entry["project_label"]
            task = entry["task_label"]
            note = entry.get("notes", "")

            dropdown = self.page.locator("select[aria-label='Select Client : Project']").nth(i)
            await dropdown.wait_for(state="visible", timeout=10000)
            await dropdown.select_option(label=project)

            task_dropdown = self.page.locator("select[aria-label='Select Task']").nth(i)
            await task_dropdown.wait_for(state="visible", timeout=10000)

            if task.lower() == "default":
                options = task_dropdown.locator("option")
                option_count = await options.count()
                for j in range(1, option_count):
                    task_value = await options.nth(j).get_attribute("value")
                    task_text = (await options.nth(j).inner_text()).strip()
                    if task_value and task_value != "0":
                        await task_dropdown.select_option(value=task_value)
                        break
            else:
                await task_dropdown.select_option(label=task)

            for day in weekdays:
                value = str(entry["custom_hours"].get(day, "0"))
                label_regex = re.compile(f"^Number of hours for {day}")
                try:
                    await self.page.get_by_label(label_regex).nth(i).fill(value)
                except Exception as e:
                    print(f"Could not fill hours for {day}: {e}")

            for day in weekdays:
                try:
                    cell = self.page.get_by_role("cell", name=re.compile(f"Additional time entry.*{day}")).nth(i)
                    await cell.get_by_label(re.compile("Additional time entry")).nth(0).click()
                    await self.page.locator("#tm_notes").fill(note)
                    await self.page.get_by_role("button", name="OK", exact=True).click()
                except Exception as e:
                    print(f"Could not add note for {day}: {e}")

            if i + 1 < len(timesheet_entries):
                print(f"Waiting for row {i + 2} to appear...")
                await self.page.locator("select[aria-label='Select Client : Project']").nth(i + 1).wait_for(state="visible", timeout=15000)

        await self.save_timesheet()

    async def save_timesheet(self):
        print("Saving timesheet...")
        await self.page.locator("#timesheet_savebutton").click()
        await self.page.wait_for_timeout(3000)
        print("Timesheet saved.")

    async def is_submission_successful(self):
        try:
            return await self.page.locator("text=Timesheet was submitted successfully").is_visible(timeout=5000)
        except:
            return False
