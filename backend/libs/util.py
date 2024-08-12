import json
from typing import Any, Dict, List
from datetime import datetime


# 주어진 텍스트에서 JSON을 로드하는 함수
def load_json(text: str) -> Dict[str, Any]:
    try:
        # 텍스트를 JSON으로 변환
        return json.loads(text)
    except json.JSONDecodeError as e:
        # JSON 디코딩 중 발생한 에러를 출력
        raise ValueError(f"Invalid JSON: {e}")


def format_events(events: List[Dict[str, Any]]) -> List[str]:
    formatted_events = []
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        start_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
        date = start_dt.strftime("%Y-%m-%d")
        time = start_dt.strftime("%H:%M")
        title = event.get("summary", "(제목 없음)")
        location = event.get("location", "(장소 없음)")
        formatted_event = f"날짜: {date}, 시간: {time}, 제목: {title}, 장소: {location}"
        formatted_events.append(formatted_event)
    return formatted_events
