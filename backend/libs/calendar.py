from datetime import datetime
import os.path
import pytz

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import Any, Dict


class GoogleCalendar:
    def __init__(self, calendar_id=None, dir_token="./"):
        self.SCOPES = ["https://www.googleapis.com/auth/calendar"]
        self.token_path = os.path.join(dir_token, "token.json")
        self.cred_path = os.path.join(dir_token, "credentials.json")
        self.calendar_id = calendar_id
        self.make_token_from_credentials()
        self.service = self.get_authenticated_service()

    def make_token_from_credentials(self):
        # 인증 정보를 저장할 변수
        creds = None

        # 이전에 저장된 토큰이 있는지 확인
        if os.path.exists(self.token_path):
            creds = Credentials.from_authorized_user_file(self.token_path, self.SCOPES)

        # 유효한 인증 정보가 없는 경우 새로 생성
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.cred_path, self.SCOPES
                )
                creds = flow.run_local_server(port=0)

            # 생성된 인증 정보를 파일로 저장
            with open(self.token_path, "w") as token:
                token.write(creds.to_json())

    def get_authenticated_service(self):
        try:
            creds = Credentials.from_authorized_user_file(self.token_path, self.SCOPES)
            return build("calendar", "v3", credentials=creds)
        except Exception as e:
            raise RuntimeError(f"Error authenticating with Google Calendar: {e}")

    def get_events_for_date(self, date_str: str) -> Dict[str, Any]:
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            timezone = pytz.timezone("Asia/Seoul")
            date_start = datetime.combine(date, datetime.min.time()).replace(
                tzinfo=timezone
            )
            date_end = datetime.combine(date, datetime.max.time()).replace(
                tzinfo=timezone
            )

            events_result = (
                self.service.events()
                .list(
                    calendarId=self.calendar_id,
                    timeMin=date_start.isoformat(),
                    timeMax=date_end.isoformat(),
                    singleEvents=True,
                    orderBy="startTime",
                )
                .execute()
            )
            return events_result
        except HttpError as e:
            raise RuntimeError(f"Error fetching events from Google Calendar: {e}")

    def set_google_calendar(self, event: Dict[str, Any]) -> None:
        try:
            self.service.events().insert(
                calendarId=self.calendar_id, body=event
            ).execute()
        except HttpError as e:
            raise RuntimeError(f"Error adding event to Google Calendar: {e}")

    def delete_google_calendar(self, event_id):
        try:
            self.service.events().delete(
                calendarId=self.calendar_id, eventId=event_id
            ).execute()
        except HttpError as e:
            raise RuntimeError(f"Error adding event to Google Calendar: {e}")

    def get_google_calendar(self, event_id):
        try:
            event = (
                self.service.events()
                .get(calendarId=self.calendar_id, eventId=event_id)
                .execute()
            )

            return event
        except HttpError as e:
            raise RuntimeError(f"Error getting event to Google Calendar: {e}")

    def get_event_id_list(self, num_events=10):
        try:
            events = self.service.events().list(calendarId=self.calendar_id).execute()
            event_id_list = [event["id"] for event in events["items"]]

            return event_id_list[-num_events:]
        except HttpError as e:
            raise RuntimeError(f"Error getting events to Google Calendar: {e}")
