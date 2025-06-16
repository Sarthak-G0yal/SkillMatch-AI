from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os

router = APIRouter()


# Define your Pydantic request model
class BookingRequest(BaseModel):
    #     name: str
    #     slot: str  # e.g., "2025-05-25 10:00 AM"

    # # Load service account credentials
    # SCOPES = ["https://www.googleapis.com/auth/calendar"]
    # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # print(BASE_DIR)
    # SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, "credentials.json")

    # credentials = service_account.Credentials.from_service_account_file(
    #     SERVICE_ACCOUNT_FILE, scopes=SCOPES
    # )
    # calendar_id = os.getenv("GOOGLE_CALENDAR_ID")  # recommended to keep calendar ID in .env
    pass


def create_event(name: str, slot: str):
    service = build("calendar", "v3", credentials=credentials)

    start = datetime.strptime(slot, "%Y-%m-%d %I:%M %p")
    end = start + timedelta(minutes=30)

    event = {
        "summary": f"Interview with {name}",
        "start": {
            "dateTime": start.isoformat(),
            "timeZone": "Asia/Kolkata",  # or your timezone
        },
        "end": {
            "dateTime": end.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
    }

    created_event = (
        service.events().insert(calendarId=calendar_id, body=event).execute()
    )
    return created_event.get("htmlLink", "")


@router.post("/book")
async def book_interview(data: BookingRequest):
    try:
        event_link = create_event(data.name, data.slot)
        return {
            "message": f"Interview booked for {data.name}",
            "event_link": event_link,
        }
    except Exception as e:
        return {"error": str(e)}
