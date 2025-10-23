export type Profile = {
  nickname: string
  gender: Gender
  age: Age
  mbtiIe: mbtiIe
  mbtiTf: mbtiTf
  mbti: MBTI
}

export type Age = 'TEN' | 'TWENTY' | 'THIRTY' | 'OVER_FOURTY'
export type Gender = 'FEMALE' | 'MALE'
export type MBTI =
  | 'ISTJ'
  | 'ISTP'
  | 'ISFJ'
  | 'ISFP'
  | 'INTJ'
  | 'INTP'
  | 'INFJ'
  | 'INFP'
  | 'ESTJ'
  | 'ESTP'
  | 'ESFJ'
  | 'ESFP'
  | 'ENTJ'
  | 'ENTP'
  | 'ENFJ'
  | 'ENFP'

export type mbtiIe = 'I' | 'E'
export type mbtiNs = 'N' | 'S'
export type mbtiTf = 'T' | 'F'
export type mbtiPj = 'P' | 'J'
