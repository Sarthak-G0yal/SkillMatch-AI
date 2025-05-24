import os
import datetime
import pytz
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'backend/credentials.json'  # adjust path as needed

def create_event(name: str, slot: str):
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )

    service = build("calendar", "v3", credentials=credentials)

    # Example: slot = "2025-05-25 10:00 AM"
    start_dt = datetime.datetime.strptime(slot, "%Y-%m-%d %I:%M %p")
    end_dt = start_dt + datetime.timedelta(minutes=30)
    timezone = 'IST'  # or your local timezone

    event = {
        'summary': f'Interview with {name}',
        'start': {'dateTime': start_dt.isoformat(), 'timeZone': timezone},
        'end': {'dateTime': end_dt.isoformat(), 'timeZone': timezone},
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    return event.get('htmlLink')
