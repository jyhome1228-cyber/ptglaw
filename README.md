# 펜타곤 법률세무회계 공식 웹사이트

공식 도메인: https://ptglaw.co.kr/

## 기술 구성
- GitHub Pages: 정적 페이지 호스팅 및 버전 관리
- Firebase Authentication: 관리자 로그인
- Cloud Firestore: 뉴스·업무사례·문의·방문 이벤트
- Firebase Storage: 뉴스 대표 이미지
- Daum 스마트워크: 별도 도메인 이메일 운영

## 주요 페이지
- 소개 /about/
- 구성원 /professionals/
- 업무분야 /services/
- 업무사례 /cases/
- 뉴스룸 /newsroom/
- 상속원스톱서비스 /inheritance/
- 법인설립지원센터 /center/
- 문의 /contact/
- 관리자 /admin/ (로그인 필요)

## 운영 점검
- 사이트맵: /sitemap.xml, 검색 접근 정책: /robots.txt
- 실제 Firestore/Storage 규칙은 저장소 파일과 별도로 Firebase Console 배포 상태 확인 필요
- 관리자 기능과 상담 폼 수정 후에는 실제 접수·로그인·확인 처리 QA 필요
- 보안 비밀키·서비스 계정 JSON·관리자 토큰은 공개 저장소에 등록 금지
- 공식 정보(연락처, 주소, 전문가 약력, 제공 업무)는 관리 주체의 최종 검토 필요
- SEO 노출은 검색엔진 색인과 콘텐츠 품질에 의존하며 검색 순위를 보장하지 않음
