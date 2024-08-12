import os
from libs.llm import response_from_llm
from libs.prompt import (
    system_task_prompt,
    user_task_prompt,
    system_event_prompt,
    user_event_prompt,
    system_calendar_date_prompt,
    user_calendar_date_prompt,
    system_date_format_prompt,
    user_date_format_prompt,
)
from libs.calendar import GoogleCalendar
from libs.util import load_json, format_events
from datetime import datetime


google_calendar = GoogleCalendar(
    calendar_id=os.getenv("GOOGLE_CALENDAR_ID"),
    dir_token="./",
)


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
            today_str = datetime.today().strftime("%Y-%m-%d")
        else:  # category == "specific"
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
