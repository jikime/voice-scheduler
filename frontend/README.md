## 기능

- 음성 인식을 통한 명령 입력
- 텍스트-음성 변환을 통한 AI 응답
- 실시간 음성 트랜스크립션
- 다국어 지원 (현재 한국어 지원)
- 브라우저 호환성 검사

## 기술 스택

- React 18.2.0
- Next.js 14.2.4
- TypeScript 5.0.4
- Tailwind CSS 3.4.4
- Radix UI 컴포넌트
- Lucide React 아이콘

## 시작하기

### 필요 조건

- Node.js (14.x 이상)
- npm 또는 yarn

### 설치

1. 저장소를 클론합니다:
   ```
   git clone https://github.com/jikime/voice-scheduler.git
   cd voice-scheduler/frontend
   ```

2. 의존성을 설치합니다:
   ```
   npm install
   ```
   또는
   ```
   yarn install
   ```

### 개발 서버 실행

```
npm run dev
```
또는
```
yarn dev
```

이 명령어로 개발 서버를 실행할 수 있습니다. 기본적으로 `http://localhost:3000`에서 앱에 접근할 수 있습니다.

### 빌드

프로덕션용 빌드를 생성하려면:

```
npm run build
```
또는
```
yarn build
```

### 프로덕션 모드 실행

빌드 후 프로덕션 모드로 앱을 실행하려면:

```
npm start
```
또는
```
yarn start
```

## 사용 방법

1. 앱을 실행하면 AI 음성 어시스턴트 인터페이스가 표시됩니다.
2. 마이크 아이콘을 클릭하여 음성 입력을 시작합니다.
3. 음성으로 명령을 내리거나 질문을 하면 AI가 응답합니다.
4. 텍스트 입력란을 통해 직접 메시지를 입력할 수도 있습니다.
5. AI의 응답은 텍스트로 표시되며 동시에 음성으로도 출력됩니다.

## 주의사항

- 음성 인식 기능을 사용하려면 최신 버전의 Chrome, Edge, 또는 Safari 브라우저를 사용해야 합니다.
- 로컬 개발 환경에서 HTTP를 사용할 경우, Chrome의 플래그 설정이 필요할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.