# Spy AI VSCode Extension

이 VSCode 확장 프로그램은 알고리즘 테스트를 위한 AI 지원 도구입니다.

## 기능

- 파일을 우클릭하여 "AI Request" 메뉴를 선택하면 파일 내용이 AI로 전송됩니다.
- AI의 응답이 클립보드에 자동으로 복사됩니다.
- 작업이 완료되면 알림이 표시됩니다.

## 설치 방법

1. VSCode에서 확장 프로그램을 로드합니다.
2. 명령 팔레트(Ctrl+Shift+P)를 열고 "Developer: Install Extension from VSIX"를 선택합니다.
3. 이 확장 프로그램의 .vsix 파일을 선택합니다.

## 사용 방법

1. 파일 탐색기에서 파일을 우클릭합니다.
2. "AI Request" 메뉴를 선택합니다.
3. gemini 토큰을 입력합니다.
4. AI의 응답이 클립보드에 복사되고 알림이 표시됩니다.

혹은

1. ctrl+shift+a 단축키를 사용합니다.
2. gemini 토큰을 입력합니다.
3. AI의 응답이 클립보드에 복사되고 알림이 표시됩니다.

## 개발 환경 설정

```bash
npm install
npm run compile
```

## 라이선스

MIT
