## 주요 기능

- 음성 명령을 통한 일정 조회 및 추가
- Google Calendar API를 활용한 일정 관리
- OpenAI API를 이용한 자연어 처리
- 텍스트-음성 변환 (TTS) 기능

## 기술 스택

- Backend: FastAPI
- Frontend: React (별도 리포지토리)
- AI/ML: OpenAI API
- 외부 서비스: Google Calendar API
- 기타: gTTS (Google Text-to-Speech)

## 설치 방법

1. 저장소를 클론합니다:
   ```
   git clone https://github.com/your-username/voice-scheduler.git
   cd voice-scheduler/backend
   ```

2. 가상 환경을 생성하고 활성화합니다:
  [Anaconda 설치](https://velog.io/@deep-of-machine/Python-%EC%95%84%EB%82%98%EC%BD%98%EB%8B%A4-%EC%84%A4%EC%B9%98-Anaconda)

3. 필요한 패키지를 설치합니다:
   ```
   pip install -r requirements.txt
   ```

4. 환경 변수를 설정합니다:
   `.env` 파일을 생성하고 다음 변수들을 설정합니다:
   ```
   GOOGLE_CALENDAR_ID=your_calendar_id
   GOOGLE_CALENDAR_API_KEY=your_api_key
   LLM_MODEL_ID=gpt-4o-mini
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Google Calendar API 인증 설정:
   - Google Cloud Console에서 프로젝트를 생성하고 Calendar API를 활성화합니다.
   - OAuth 2.0 클라이언트 ID를 생성하고 credentials.json 파일을 다운로드하여 프로젝트 루트 디렉토리에 저장합니다.

## 실행 방법

1. FastAPI 서버를 실행합니다:
   ```
   uvicorn api:app --reload --port 8000
   ```

2. 프론트엔드 애플리케이션을 실행합니다.

## API 엔드포인트

- POST `/text-to-speech`: 텍스트를 음성으로 변환하고 일정 관리 명령을 처리합니다.

## 파일 구조

- `api.py`: FastAPI 애플리케이션 및 메인 엔드포인트
- `calendar.py`: Google Calendar API 연동 로직
- `llm.py`: OpenAI API를 사용한 자연어 처리 로직
- `process.py`: 일정 관리 프로세스 및 명령 처리 로직

## 주의사항

- 이 애플리케이션은 개발 목적으로 만들어졌습니다. 프로덕션 환경에서 사용하려면 추가적인 보안 조치가 필요합니다.
- API 키와 인증 정보를 안전하게 관리하세요.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.