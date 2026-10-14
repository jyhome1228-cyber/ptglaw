# 펜타곤 Firebase CMS — 초기 설정

## 현 상태

- 웹사이트 운영: **GitHub Pages 유지**
- Firebase 프로젝트: `ptglaw-8f411`
- 이 단계에서 Firebase SDK 초기화/로그인/데이터 이전/기존 화면 교체 **미실행**
- 기존 `content/news.json`과 `content/cases.json` 및 공개 페이지는 그대로 유지
- Firebase Hosting을 사용하거나 자동 배포하지 않음

## Firestore 설정

1. Firebase 콘솔에서 `ptglaw-8f411` 프로젝트의 Cloud Firestore 생성
2. 위치 선택 시 운영 위치 고려 (예: `asia-northeast3`) — 생성 후 위치 변경이 어렵습니다
3. **규칙(Rules)** 에 저장소 `firestore.rules`의 내용을 붙여넣고 **게시**
4. Authentication의 이메일/비밀번호 제공업체 활성화 (로그인 UI 연결은 후속 단계)
5. Authentication → 사용자에서 관리자를 만든 다음 해당 사용자의 UID 확인
6. Firestore 데이터 → `admins` 컬렉션 → **문서 ID = 관리자 UID**, `role`(string) = `admin` 작성

### 중요: GitHub 커밋 ≠ Firebase 규칙 배포

`firebase.json`은 Firestore 규칙/인덱스 파일의 **배포 경로만** 정의합니다. GitHub에 파일을 올리는 것만으로 Firebase 규칙은 적용되지 않습니다.

향후 Firebase CLI를 사용할 경우 인증 후 같은 프로젝트를 명시하여 규칙을 배포할 수 있습니다:

```bash
firebase deploy --only firestore:rules,firestore:indexes --project ptglaw-8f411
```

현재 `firestore.indexes.json`은 사용자 지정 인덱스가 없는 기본값입니다.

## 보안 원칙

- 공개 이용자는 `status == "published"` 문서만 조회 가능
- 관리자 권한은 `admins/{uid}`의 `role: "admin"`으로 판정
- 클라이언트에서 `admins` 문서를 생성/수정/삭제할 수 없음 (Firebase 콘솔에서만 관리자 관리)
- 다른 컬렉션은 기본적으로 읽기/쓰기 차단
- 임시저장 문서도 공개 규칙으로 보호하되, Firestore 관리자 콘솔 접근 권한은 따로 관리
- 공개 목록 조회 쿼리는 반드시 `where("status", "==", "published")`를 포함해야 함
- 웹 설정의 `apiKey`는 브라우저용 식별정보이며 **Firebase 서비스 계정 키·관리자 토큰은 절대 GitHub에 커밋하지 않음**
- Firestore와 Authentication 접근 통제는 운영 전 에뮬레이터 및 실제 사용자 권한으로 별도 검증 필요

## 향후 데이터 형식 (계획)

```text
news/{id}
  title, date, source, summary, category, url, image, status
  createdAt, updatedAt

cases/{id}
  title, summary, meta1, meta2, result, tags, categories
  overview, strategy, resultBody, point, experts, status
  createdAt, updatedAt

admins/{firebaseAuthUid}
  role: "admin"
```

- 사례 담당자는 기존 네 명(채용현, 강건, 전승환, 김지수)을 선택할 수 있도록 후속 관리 UI에 연결합니다
- 기존 뉴스 36건과 사례 15건은 백업·마이그레이션 스크립트 및 화면 검증 후 이전할 예정입니다
- `draft`는 리스트/페이지 외부에 노출되지 않도록 운영하며, 사용자가 URL로 접근하는 경우도 거부합니다

## 운영 전 추가 검토

- Firestore 규칙에서 컬렉션별 허용 필드·데이터 타입·문서 크기 등 쓰기 검증 보강
- 보안 규칙 및 쿼리 인덱스 테스트, API 오류 표시
- 관리자 인증 화면과 로그아웃·세션 관리, 신규 콘텐츠 편집기
- 뉴스/사례 상세페이지에 연결 및 기존 URL 유지
- 이미지 보관 정책(Storage 연결 시 별도 rules 필요)

## 2026-10-14 운영 대시보드 및 문의 연결

- `/admin/`: 대시보드, 방문자(연동 상태), SEO 메타정보 진단, 계산기 목록, 문의 관리, 뉴스, 업무사례
- `inquiries`: `type=quick`(빠른 문의)와 `type=general`(일반/견적 문의)로 구분
- 공개 문의 작성은 지정 필드와 길이를 검사하고, 문의 목록/수정은 관리자 전용
- 공개 사이트의 기존 이메일 기반 문의는 새 규칙을 실제 게시하기 전에는 Firestore 저장에 실패하며, 이 경우 이메일 대체 경로만 제공
- **중요:** `firestore.rules`에 `inquiries` 컬렉션 규칙을 추가했으므로 Firebase 콘솔 규칙 탭에서 다시 게시해야 함
- 개인정보 포함 문의를 실제로 받기 전에 개인정보처리방침(목적, 수집항목, 보유기간, 위탁/제3자 처리 등) 및 접근 권한을 운영 담당자가 확인할 것
- 악용 방지를 위해 Firebase App Check, 사용량 경보 및 스팸 대응책을 운영 전 준비할 것
- 방문자 수, 검색엔진 실제 노출, 계산기 사용 횟수는 아직 보고 API/분석 이벤트가 연결되지 않아 표시하지 않음. SEO 메뉴는 HTML 내 메타정보 존재 여부 진단만 수행
- GA4 Measurement ID/GA4 Data API 권한이 준비되면 실제 방문자 지표를 연결할 수 있음
