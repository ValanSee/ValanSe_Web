# 화면 명세서: MT 밸런스게임 PPT 무료 다운로드 (MT PPT)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-TOPICS-002 |
| 화면명 | MT 밸런스게임 PPT 무료 다운로드 |
| 경로 | `/topics/mt-ppt` |
| 인증 필요 | ✗ |
| 작성일 | 2026-11-03 |
| 관련 디자인 | 없음 (주제 추천 `TopicCard` 스타일 재사용) |

## 🎯 화면 목적

"MT 밸런스게임 PPT", "밸런스게임 PPT" 같은 검색어로 들어온 모임 준비자에게 프로젝터용 샘플 PPT(질문 10개, 23장)를 무료로 주고, 맞춤 25문항 세트(행사 1회 3만 원) 문의로 이어지게 한다.

## 🚪 진입 경로

- 주제 추천(`/topics`, SCR-TOPICS-001) 안내 카드의 `MT·모임용 밸런스게임 PPT 무료 다운로드`
- PC 푸터 `MT 밸런스게임 PPT`
- 검색 결과 (sitemap 등록, canonical `/topics/mt-ppt`)

## 🖥️ 렌더링 (SEO)

- 정적 페이지. 데이터 조회 없음 (질문 목록은 `constants/mtPpt.ts`)
- title `MT 밸런스게임 PPT 무료 다운로드 - 모임·워크숍용 질문 10개`, OG 이미지는 표지 미리보기
- JSON-LD: BreadcrumbList (홈 › 주제 추천 › MT PPT), DigitalDocument (PPTX, 무료, 질문 10개 → `/poll/{id}`), FAQPage

## 📐 레이아웃 구성

1. **헤더** (모바일 전용, 뒤로가기 · `MT 밸런스게임 PPT`)
2. **소개** — h1 + 설명
3. **미리보기·다운로드** — 슬라이드 4장 2열 그리드(`public/assets/mt-ppt/*.webp`) + `무료 샘플 PPT 내려받기 (PPTX)` + 파일 정보
4. **이렇게 쓰면 돼요** — 3단계
5. **들어 있는 질문 10개** — 각 항목 → `/poll/{id}`, 카드 `더보기` → `/topics`
6. **맞춤 세트 문의** — 가격·납기 + `맞춤 세트 문의하기`(구글폼 새 탭)
7. **자주 묻는 질문** — 3문항
8. **하단 네비게이션 바** (모바일)

## 🧩 동작

- 다운로드: `public/downloads/valanse-mt-balance-game-sample.pptx` 를 `MT_모임_밸런스게임_샘플.pptx` 로 저장
- 다운로드 클릭 시 프로덕션에서만 `POST /analytics/events/page-view` (`pagePath: /topics/mt-ppt#download`) — 별도 분석 도구 없이 다운로드 수 측정. 실패는 무시

## ✅ 수용 기준

- Given `/topics/mt-ppt` When 다운로드 버튼 클릭 Then PPTX 파일 저장, 23장, 파워포인트에서 열림
- Given 질문 항목 클릭 Then 해당 `/poll/{id}` 로 이동
- Given 서버 HTML Then h1 · 질문 10개 링크 · JSON-LD 3종 포함

## 🔄 파일 갱신

PPT 와 미리보기는 `valanse-event-deck` 생성기로 만든다 (`sample-mt.json`, 손 들기 모드). 질문을 바꾸면 PPTX · 미리보기 4장 · `constants/mtPpt.ts` 의 질문 목록을 함께 바꾼다.

## 📎 관련 문서

- `SCR-TOPICS-001_topics.md`
