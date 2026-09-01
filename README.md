# PTG LAW Website

아임웹에서 GitHub 기반 정적 사이트로 이전 중인 펜타곤 법률세무회계 공식 웹사이트입니다.

## Current structure
- `/` 메인
- `/about/` 펜타곤 소개
- `/professionals/` 구성원
- `/services/` 업무분야
- `/services/legal/`
- `/services/tax/`
- `/services/ip/`
- `/services/recovery/`
- `/services/registry/`
- `/cases/` 업무사례
- `/newsroom/` 뉴스룸
- `/center/` 법인설립지원센터
- `/contact/` 상담 문의
- `/privacy/` 개인정보처리방침

## Migration status
### 1차 완료
- 공통 헤더/푸터
- 반응형 디자인 시스템
- 주요 페이지 골격
- 메인 핵심 메시지 및 5개 전문영역
- 기본 SEO meta/canonical
- LegalService JSON-LD
- robots.txt / sitemap.xml / 404

### 다음 작업
- 기존 아임웹 이미지 및 로고 자산 이전
- 전체 구성원 프로필/사진 이전
- 업무사례 전체 데이터 이전
- 뉴스룸 데이터(JSON) 기반 자동 렌더링
- 상담폼 서버 연동 및 파일 업로드
- 기존 URL 301 redirect 설계
- OG 이미지 / favicon / Person / Article schema
- Cloudflare Pages 배포 및 최종 도메인 전환

## Domain migration
운영 중인 `ptglaw.co.kr`은 새 사이트 검수 완료 전까지 변경하지 않습니다.
