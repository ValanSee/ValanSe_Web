import { z } from 'zod'
import type { Age, Gender, MBTI } from '@/types/member'

// member 타입과 값이 어긋나면 satisfies가 컴파일 단계에서 잡아준다.
const GENDER_VALUES = ['FEMALE', 'MALE'] as const satisfies readonly Gender[]

const AGE_VALUES = [
  'TEN',
  'TWENTY',
  'THIRTY',
  'OVER_FOURTY',
] as const satisfies readonly Age[]

const MBTI_VALUES = [
  'ISTJ',
  'ISTP',
  'ISFJ',
  'ISFP',
  'INTJ',
  'INTP',
  'INFJ',
  'INFP',
  'ESTJ',
  'ESTP',
  'ESFJ',
  'ESFP',
  'ENTJ',
  'ENTP',
  'ENFJ',
  'ENFP',
] as const satisfies readonly MBTI[]

/**
 * 온보딩 폼의 입력값 스키마.
 * - 서버 enum 값을 그대로 폼 값으로 사용한다(라벨은 표시용 매핑).
 * - role/mbtiIe/mbtiTf 같은 파생 값은 제출 시점에 변환한다(스키마에 두지 않음).
 */
export const onboardingSchema = z.object({
  nickname: z.string().trim().min(1, '닉네임을 입력해주세요'),
  // 비동기 중복 확인이 통과해야만 true. 닉네임이 바뀌면 false로 리셋한다.
  nicknameVerified: z.literal(true, {
    errorMap: () => ({ message: '닉네임 중복 확인을 해주세요' }),
  }),
  gender: z.enum(GENDER_VALUES, {
    errorMap: () => ({ message: '성별을 선택해주세요' }),
  }),
  age: z.enum(AGE_VALUES, {
    errorMap: () => ({ message: '나이를 선택해주세요' }),
  }),
  mbti: z.enum(MBTI_VALUES, {
    errorMap: () => ({ message: 'MBTI를 선택해주세요' }),
  }),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>
