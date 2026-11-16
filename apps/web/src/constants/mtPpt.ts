/**
 * MT·모임용 밸런스게임 무료 샘플 PPT (/topics/mt-ppt).
 * 파일은 valanse-event-deck 생성기(sample-mt.json, 손 들기 모드)로 만든다.
 * 질문을 바꾸면 PPT 파일과 미리보기 이미지(public/assets/mt-ppt)도 함께 다시 뽑아야 한다.
 */

export const MT_PPT_PATH = '/topics/mt-ppt'
export const MT_PPT_FILE = '/downloads/valanse-mt-balance-game-sample.pptx'
export const MT_PPT_FILE_NAME = 'MT_모임_밸런스게임_샘플.pptx'
/** 다운로드 클릭을 페이지뷰 이벤트로 기록할 때 쓰는 경로 (별도 분석 인프라 없이 수요 측정) */
export const MT_PPT_DOWNLOAD_EVENT_PATH = `${MT_PPT_PATH}#download`

export const MT_PPT_SLIDE_COUNT = 23

/** PPT 에 들어 있는 질문. id 는 ValanSe 투표 id (상세 페이지 내부 링크용) */
export const MT_PPT_QUESTIONS: {
  id: number
  title: string
  options: string[]
}[] = [
  { id: 31, title: '야식 고르기', options: ['피자', '마라탕', '떡볶이'] },
  {
    id: 19,
    title: '라면 끓일 때, 면 먼저 vs 스프 먼저?',
    options: ['면 먼저', '스프 먼저'],
  },
  { id: 13, title: '치킨 vs 피자, 야식의 왕은?', options: ['치킨', '피자'] },
  {
    id: 21,
    title: '아이스 아메리카노 vs 따뜻한 라떼?',
    options: ['아이스 아메리카노', '따뜻한 라떼'],
  },
  {
    id: 3,
    title: '여름 휴가, 해외여행 vs 국내여행?',
    options: ['해외여행', '국내여행'],
  },
  { id: 22, title: '운동, 혼자 vs 같이?', options: ['혼자', '같이'] },
  {
    id: 14,
    title: '고백 타이밍, 만난 지 1달 vs 3달?',
    options: ['1달', '3달'],
  },
  {
    id: 20,
    title: '연인과 싸운 후, 먼저 사과하기 vs 기다리기?',
    options: ['먼저 사과하기', '기다리기'],
  },
  {
    id: 8,
    title: '맵고수 인정? 매운 음식 레벨은?',
    options: [
      '신라면도 매워요',
      '엽떡 정도는 먹죠',
      '불닭볶음면은 기본',
      '핵불닭도 가능',
    ],
  },
  {
    id: 37,
    title: '누가 좋아?',
    options: ['1년에 연애 4번씩 한사람', '한 사람과 9년 사귀었던사람'],
  },
]

export const MT_PPT_PREVIEWS = [
  {
    src: '/assets/mt-ppt/cover.webp',
    alt: '표지 슬라이드: MT · 모임 밸런스게임',
  },
  {
    src: '/assets/mt-ppt/guide.webp',
    alt: '진행 방법 슬라이드: 질문을 띄운다, 동시에 고른다, 세어 본다, 이유를 말한다',
  },
  {
    src: '/assets/mt-ppt/question.webp',
    alt: '질문 슬라이드: 라면 끓일 때, 면 먼저 vs 스프 먼저?',
  },
  {
    src: '/assets/mt-ppt/reveal.webp',
    alt: '공개 슬라이드: 우리는 몇 대 몇? 만장일치면 반대편을 변호할 사람 한 명',
  },
]

export const MT_PPT_STEPS = [
  {
    title: '내려받기',
    body: 'PPTX 파일이라 파워포인트·키노트·구글 슬라이드에서 바로 열려요. 질문 문구도 자유롭게 고칠 수 있어요.',
  },
  {
    title: '프로젝터에 띄우기',
    body: '질문 장과 공개 장이 번갈아 나와요. 사회자는 넘기기만 하면 돼요.',
  },
  {
    title: '손 들고 이유 말하기',
    body: '"하나 둘 셋" 하면 동시에 손을 들고, 소수파부터 왜 그쪽인지 한마디씩. 10문항이면 25분 정도 걸려요.',
  },
]

export const MT_PPT_FAQS = [
  {
    question: '정말 무료인가요?',
    answer:
      '네. 회원가입 없이 바로 내려받을 수 있고, 모임에서 자유롭게 쓰셔도 돼요.',
  },
  {
    question: '질문을 바꿔도 되나요?',
    answer:
      'PPTX 원본이라 문구·순서를 마음대로 고칠 수 있어요. 더 많은 질문은 밸런스게임 주제 추천에서 골라 보세요.',
  },
  {
    question: '우리 모임에 맞춘 질문으로 받을 수 있나요?',
    answer:
      '모임 성격과 인원에 맞춘 질문 25개를 PPT와 참여자 폰 투표 링크로 만들어 드려요. 행사 1회 3만 원이고, 문의 후 2일 안에 전달해요.',
  },
]
