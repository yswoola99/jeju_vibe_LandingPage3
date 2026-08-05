# 제주 AI 바이브코딩 랜딩페이지

비전공자를 위한 1일 AI 바이브코딩 체험 클래스를 홍보하는 랜딩페이지입니다. 제주 지역 직장인·자영업자를 대상으로, 무료 체험 클래스 신청을 유도하는 것이 목적입니다.

## 구성

빌드 도구나 프레임워크 없이 순수 HTML/CSS/JS로 작성된 정적 사이트입니다.

```
.
├── index.html                 # 랜딩페이지 전체 마크업 (헤더, 히어로, 고민 공감, 클래스 소개, 커리큘럼, 강사소개, FAQ, 신청 폼, 푸터)
├── css/
│   └── style.css              # 전체 스타일
├── js/
│   └── main.js                # FAQ 아코디언, 신청 폼 제출, 헤더 스크롤 효과
└── google-apps-script/
    └── Code.gs                # 신청 폼 백엔드 (Google Apps Script)
```

## 주요 기능

- **FAQ 아코디언**: 질문 클릭 시 답변이 펼쳐지는 UI (`main.js`)
- **무료 체험 신청 폼**: 이름/연락처/이메일/현재 상태/메시지를 입력받아 제출
- **헤더 스크롤 효과**: 스크롤 시 헤더에 그림자 추가

## 신청 폼 동작 방식

신청 폼은 별도의 서버 없이 **Google Apps Script**를 백엔드로 사용합니다.

1. 사용자가 폼을 제출하면 `js/main.js`가 `APPLY_ENDPOINT`(Apps Script 웹 앱 URL)로 `fetch` 요청을 보냅니다.
2. Apps Script(`google-apps-script/Code.gs`)가 요청을 받아:
   - 스프레드시트의 `신청내역` 시트에 신청 내용을 저장하고
   - 관리자(`NOTIFY_EMAIL`)에게 신청 알림 메일을 보내고
   - 신청자에게 접수 확인 자동회신 메일을 보냅니다.
3. Apps Script 응답은 CORS를 지원하지 않아 `no-cors` 모드로 요청하며, 프론트엔드에서는 응답 내용을 읽지 않고 요청 전송 성공 여부만으로 성공 화면을 표시합니다.

### Apps Script 배포 시 설정할 값 (`Code.gs`)

| 변수 | 설명 |
| --- | --- |
| `NOTIFY_EMAIL` | 신청 알림을 받을 관리자 이메일 |
| `SHEET_NAME` | 신청 내역을 저장할 시트 이름 (기본값: `신청내역`) |

배포 후 발급되는 웹 앱 URL은 `js/main.js`의 `APPLY_ENDPOINT` 상수에 반영해야 합니다.

## 로컬에서 실행하기

빌드 과정이 없으므로 정적 파일 서버로 바로 열면 됩니다.

```bash
# 예시: VS Code Live Server, 또는
npx serve .
```

`index.html`을 브라우저로 직접 열어도 대부분의 기능은 동작하지만, 폼 제출 테스트를 위해서는 로컬 서버 실행을 권장합니다.

## 배포

[Vercel](https://vercel.com)에 정적 사이트로 배포되어 있습니다 (`.vercel/project.json` 참고). 별도의 빌드 커맨드 없이 루트의 `index.html`을 그대로 서빙합니다.

## 환경 변수

`.env.local`, `.vercel` 디렉터리는 `.gitignore`에 의해 버전 관리에서 제외됩니다.
