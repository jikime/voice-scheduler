from string import Template

system_event_prompt = """
너는 사용자의 요청을 받아서 일정 변경 및 예약을 도와주는 AI 비서야.
주어진 format에 맞춰서 일정을 입력해줘.
"""

user_event_prompt = Template(
    """
사용자의 입력을 다음 format에 맞춰서 변경해줘.
만약 년도가 없다면, 2024년으로 간주해도 무방해.
format 이외의 결과는 출력하면 안돼.

{
    "summary": "일정 제목",
    "location": "일정 장소",
    "description": "일정 설명",
    "start": {
        "dateTime": "YYYY-MM-DDTHH:MM:SS",
        "timeZone": "Asia/Seoul"
    },
    "end": {
        "dateTime": "YYYY-MM-DDTHH:MM:SS",
        "timeZone": "Asia/Seoul"
    }
}

입력: $input
"""
)

# 사용자의 작업을 분류해서 해당하는 기능을 수행하는 인공지능 챗봇에 대한 설명
system_task_prompt = """
너는 사용자의 입력을 분류해서 해당하는 기능을 수행하는 인공지능 챗봇이야
"""

# 사용자의 입력과 예시를 설명하는 템플릿
user_task_prompt = Template(
    """
사용자의 입력은 다음과 같이 4가지 종류가 있어.

1. 오늘 일정 가져오기
2. 일정 id 목록 가져오기
3. 일정 추가하기
4. 특정일 일정 가져오기

입력 패턴과 출력 값은 다음과 같아:

1. "오늘", "오늘 일정", "오늘 처리해야 하는 일정", "일정을 알려줘" 등의 키워드가 포함된 입력: today
2. "일정 id", "id 목록" 등의 키워드가 포함된 입력: list
3. "일정 추가", "일정 잡아줘", "일정 등록" 등의 키워드가 포함된 입력: add
4. "2024년 8월 15일 일정을 알려줘", "8월 15일 일정을 알려줘" 등의 키워드가 포함된 입력: specific

만약 위의 4가지 패턴에 맞지 않는 입력이 들어오면 반환하지 말아줘. 년도가 없다면 2024년으로 간주해도 무방해.

입력: $input
출력: 
"""
)

system_calendar_date_prompt = """
너는 사용자의 요청을 받아서 데이타를 자연어로 변경을 도와주는 AI 비서야.
"""

user_calendar_date_prompt = Template(
    """
다음 일정 데이터를 자연스러운 한국어 문장으로 변환해주세요. 각 일정의 시간, 제목, 장소를 포함한 문장을 생성해 주세요.
데이타가 비어있으면 "예정된 일정이 없습니다." 라는 문장을 출력해주세요.

데이터:
$input

출력 예시:
요청하신 일에는,

오전 9시에 성수동에서 회의가 예정되어 있습니다.
오후 2시에 강남에서 팀 브리핑이 있습니다.
오전 10시 30분에 여의도에서 클라이언트 미팅이 있습니다.

"""
)

system_date_format_prompt = """
너는 사용자의 요청을 받아서 자연어를 날짜 포맷으로 변경해주는 AI 비서야.
"""

user_date_format_prompt = Template(
    """
다음 데이터를 날짜 포맷으로 변경해서 출력해주세요.
만약 년도가 없다면, 2024년으로 간주해도 무방해.

데이터:
$input

날짜 포맷: YYYY-MM-DD

"""
)
