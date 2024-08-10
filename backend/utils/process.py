import os
from utils.llm import response_from_llm
from utils.prompt import (
    system_task_prompt,
    user_task_prompt,
    system_event_prompt,
    user_event_prompt,
    system_calendar_date_prompt,
    user_calendar_date_prompt,
    system_date_format_prompt,
    user_date_format_prompt
)
from utils.calendar import GoogleCalendar
from utils.util import load_json
from datetime import datetime

google_calendar = GoogleCalendar(
    calendar_id=os.getenv("GOOGLE_CALENDAR_ID"),
    google_calendar_api_key=os.getenv("GOOGLE_CALENDAR_API_KEY"),
    dir_token="./",
)


def format_events(events):
    formatted_events = []
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        end = event["end"].get("dateTime", event["end"].get("date"))

        start_dt = datetime.fromisoformat(start)

        date = start_dt.strftime("%Y-%m-%d")
        time = start_dt.strftime("%H:%M")
        title = event.get("summary", "(제목 없음)")
        location = event.get("location", "(장소 없음)")

        formatted_event = f"날짜: {date}, 시간: {time}, 제목: {title}, 장소: {location}"
        formatted_events.append(formatted_event)

    return formatted_events


def calendar_process(event):
    # 이벤트에 대한 응답을 얻습니다.
    category = response_from_llm(event, system_task_prompt, user_task_prompt)
    print(category)

    # 결과가 유효한 명령어가 아닌 경우
    if category not in ["list", "add", "today", "specific"]:
        print(f"유효하지 않은 결과입니다 : {category}")
        return f"유효하지 않은 입력입니다."

    # 오늘의 일정을 가져오는 경우
    if category == "today" or category == "specific":
        print("오늘 또는 특정일의 일정을 가져오는 기능을 수행합니다.")

        if category == "today":
            today_str = datetime.today().strftime('%Y-%m-%d')
        else: # category == "specific"
            today_str = response_from_llm(
                event, system_date_format_prompt, user_date_format_prompt
            )
        events = google_calendar.get_events_for_date(today_str)
        formatted_events = format_events(events["items"])
        return response_from_llm(
            "\n".join(formatted_events),
            system_calendar_date_prompt,
            user_calendar_date_prompt,
        )
    # 일정 목록을 가져오는 경우
    # elif category == "list":
    #     print("일정 id 목록을 가져오는 기능을 수행합니다.")
    #     return google_calendar.get_event_id_list()
    # 일정을 추가하는 경우
    elif category == "add":
        print("일정 추가하기 기능을 수행합니다.")
        json_str = response_from_llm(event, system_event_prompt, user_event_prompt)
        print(json_str)
        google_calendar.set_google_calendar(load_json(json_str))
        return "일정이 추가되었습니다."
