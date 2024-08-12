import os
from datetime import datetime
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END
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

google_calendar = GoogleCalendar(
    calendar_id=os.getenv("GOOGLE_CALENDAR_ID"), dir_token="./"
)


# State definition
class State(TypedDict):
    input: str
    task: str
    date: str
    events: List[str]
    output: str
    error: str


# Node functions
def classify_task(state: State) -> State:
    try:
        task = response_from_llm(state["input"], system_task_prompt, user_task_prompt)
        if task not in ["today", "specific", "add"]:
            raise ValueError(f"Invalid task classification: {task}")
        return {"task": task}
    except Exception as e:
        return {"error": f"Error in task classification: {str(e)}"}


def process_date(state: State) -> State:
    print("state==>", state)
    try:
        if state["task"] == "today":
            return {"date": datetime.today().strftime("%Y-%m-%d")}
        elif state["task"] == "specific":
            date = response_from_llm(
                state["input"], system_date_format_prompt, user_date_format_prompt
            )
            # Validate the date format
            datetime.strptime(date, "%Y-%m-%d")
            return {"date": date}
        return {"date": ""}  # 빈 문자열 반환하여 키는 항상 존재하도록 함
    except ValueError as e:
        return {"error": f"Invalid date format: {str(e)}"}
    except Exception as e:
        return {"error": f"Error processing date: {str(e)}"}


def get_events(state: State) -> State:
    print("get events state==>", state)
    try:
        events = google_calendar.get_events_for_date(state["date"])
        formatted_events = format_events(events["items"])
        return {"events": formatted_events}
    except Exception as e:
        return {"error": f"Error fetching events: {str(e)}", "events": []}


def add_event(state: State) -> State:
    try:
        json_str = response_from_llm(
            state["input"], system_event_prompt, user_event_prompt
        )
        event_data = load_json(json_str)
        google_calendar.set_google_calendar(event_data)
        print("event_data==>", event_data)
        return {"output": "일정이 성공적으로 추가되었습니다."}
    except ValueError as e:
        return {"error": f"Error parsing event data: {str(e)}"}
    except Exception as e:
        return {"error": f"Error adding event: {str(e)}"}


def format_response(state: State) -> State:
    print("format state==>", state)
    try:
        if state.get("error") != None:
            return {"output": f"오류가 발생했습니다: {state['error']}"}
        elif state["task"] in ["today", "specific"]:
            if not state["events"]:
                return {"output": "해당 날짜에 예정된 일정이 없습니다."}
            response = response_from_llm(
                "\n".join(state["events"]),
                system_calendar_date_prompt,
                user_calendar_date_prompt,
            )
            return {"output": response}
        else:
            return {"output": state["output"]}
    except Exception as e:
        return {"output": f"응답 형식화 중 오류 발생: {str(e)}"}


# Graph definition
workflow = StateGraph(State)

# Define the nodes
workflow.add_node("classify_task", classify_task)
workflow.add_node("process_date", process_date)
workflow.add_node("get_events", get_events)
workflow.add_node("add_event", add_event)
workflow.add_node("format_response", format_response)

# Define the edges
workflow.add_edge(START, "classify_task")
workflow.add_conditional_edges(
    "classify_task",
    lambda x: x["task"] if "error" not in x else "format_response",
    {
        "today": "process_date",
        "specific": "process_date",
        "add": "add_event",
    },
)
workflow.add_conditional_edges(
    "process_date",
    lambda x: "get_events" if x["task"] in ["today", "specific"] else "format_response",
    {"get_events": "get_events", "format_response": "format_response"},
)
workflow.add_edge("get_events", "format_response")
workflow.add_edge("add_event", "format_response")
workflow.add_edge("format_response", END)

app = workflow.compile()


def run_workflow(user_input: str) -> str:
    try:
        result = app.invoke({"input": user_input})
        return result["output"]
    except Exception as e:
        return f"워크플로우 실행 중 오류 발생: {str(e)}"
