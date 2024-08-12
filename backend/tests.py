from libs.graph import run_workflow


if __name__ == "__main__":
    user_input = "8월 13일에 한비로 대회의실에 오전 10시부터 11시까지 회의 일정 추가해줘"
    result = run_workflow(user_input)
    print(result)

