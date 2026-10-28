# 화면 명세서: 서비스 소개 · 자주 묻는 질문 (About)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-ABOUT-001 |
| 화면명 | 서비스 소개 · 자주 묻는 질문 |
| 경로 | `/about` |
| 인증 필요 | ✗ |
| 작성일 | 2026-10-28 |
| 최종 수정일 | 2026-10-28 |
| 관련 디자인 | 없음 (주제 추천 페이지 카드 스타일 재사용) |

## 🎯 화면 목적

"ValanSe 가 뭐야", "밸런스게임 사이트 로그인 없이 돼?" 같은 질문에 AI 검색(ChatGPT · Perplexity · 구글 AI 개요)과 검색엔진이 인용할 수 있는 서비스 설명과 FAQ 를 한 페이지에 정적 문구로 둔다 (GEO).

## 🚪 진입 경로

- PC 푸터 `안내` › `서비스 소개 · FAQ`
- 검색 결과 (sitemap 등록, canonical `/about`) · `/llms.txt` 주요 페이지

## 🖥️ 렌더링 (SEO)

- API 호출 없는 정적 페이지 (서버 컴포넌트)
- title `ValanSe(밸런스) 소개 · 자주 묻는 질문`, canonical `/about`
- JSON-LD: Organization (`sameAs` Google Play `com.valanse`) · FAQPage (화면 FAQ 와 같은 문구) · BreadcrumbList (홈 › 서비스 소개)
  - FAQ 리치 결과는 구글에서 정부 · 의료 사이트만 표시되지만 Bing · AI 검색이 읽는 용도

## 📐 레이아웃 구성

1. **헤더** (모바일 전용, 뒤로가기 · `서비스 소개`)
2. **소개** — h1 `ValanSe(밸런스) 소개` + 소개 문구 (카테고리 이름 · 개수는 `CATEGORIES` 에서)
3. **자주 묻는 질문** — 8문항 (`constants/about.ts` `ABOUT_FAQS`)
4. **하단 네비게이션 바** (모바일)

### PC 레이아웃 (`lg` ≥ 1024px)

- 공통 GNB · 푸터, 768px 컬럼 (`DESKTOP_PAGE_COLUMN`). 모바일 헤더 · 하단 네비게이션 바 숨김

## 🧩 섹션별 상세 명세

### 3. 자주 묻는 질문

- 밸런스게임이 뭔가요? · 로그인 없이도 볼 수 있나요? · 결과는 어떻게 보나요? · 어떻게 만드나요? (`/create`) · 상황별 질문 추천 (`/topics`) · 포인트와 칭호 · 앱 (Google Play, 새 탭) · MT · 워크숍 · 모임 (구글폼 `EVENT_INQUIRY_FORM_URL`, 새 탭)
- 링크가 있는 답변은 끝에 밑줄 링크

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 없음 | 정적 페이지 |

## 🔌 사용 API

없음

## 📎 관련 문서

- `SCR-TOPICS-001_topics.md`
- `SCR-PRIVACY-001_privacy.md`
