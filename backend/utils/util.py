import json


# 주어진 텍스트에서 JSON을 로드하는 함수
def load_json(text):
    try:
        # 텍스트를 JSON으로 변환
        event = json.loads(text)
        return event
    except json.JSONDecodeError as e:
        # JSON 디코딩 중 발생한 에러를 출력
        print(f"JSON 디코딩 에러: {e}")
        return None
