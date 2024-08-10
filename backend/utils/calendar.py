from datetime import datetime
import os.path
import pytz

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


class GoogleCalendar:
    def __init__(self, calendar_id=None, google_calendar_api_key=None, dir_token="./"):
        self.SCOPES = ["https://www.googleapis.com/auth/calendar"]
        self.token_path = os.path.join(dir_token, "token.json")
        self.cred_path = os.path.join(dir_token, "credentials.json")
        self.calendar_id = calendar_id
        self.google_calendar_api_key = google_calendar_api_key
        self.service = self.get_authenticated_service()

    def get_authenticated_service(self):
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

        return build("calendar", "v3", credentials=creds)

    def get_events_for_date(self, date_str):
        """
        주어진 날짜(date_str)에 해당하는 이벤트를 가져옵니다.
        :param date_str: 'YYYY-MM-DD' 형식의 날짜 문자열
        :return: 해당 날짜의 이벤트 목록
        """
        # 타임존 설정 (예: 'Asia/Seoul')
        timezone = pytz.timezone("Asia/Seoul")

        # 문자열을 datetime 객체로 변환
        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # 주어진 날짜의 시작과 끝 시간 설정
        date_start = datetime.combine(date, datetime.min.time()).replace(
            tzinfo=timezone
        )
        print("시작일 =>", date_start)
        date_end = datetime.combine(date, datetime.max.time()).replace(tzinfo=timezone)

        # 구글 캘린더 API 호출
        events_result = (
            self.service.events()
            .list(
                calendarId="primary",
                timeMin=date_start.isoformat(),
                timeMax=date_end.isoformat(),
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )

        return events_result

    def set_google_calendar(self, event):
        self.service.events().insert(calendarId=self.calendar_id, body=event).execute()

    def delete_google_calendar(self, event_id):
        self.service.events().delete(
            calendarId=self.calendar_id, eventId=event_id
        ).execute()

    def get_google_calendar(self, event_id):
        event = (
            self.service.events()
            .get(calendarId=self.calendar_id, eventId=event_id)
            .execute()
        )

        return event

    def get_event_id_list(self, num_events=10):
        events = self.service.events().list(calendarId=self.calendar_id).execute()
        event_id_list = [event["id"] for event in events["items"]]

        return event_id_list[-num_events:]
