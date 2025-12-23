export type CreateMemberProfileRequest = {
  nickname: string
  gender: 'FEMALE' | 'MALE'
  age: 'TEN' | 'TWENTY' | 'THIRTY' | 'OVER_FOURTY'
  mbtiIe: 'I' | 'E'
  mbtiTf: 'T' | 'F'
  mbti:
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
  role: 'USER' | 'ADMIN'
}

export type FetchMemberProfileResponse = {
  profile: {
    nickname: string
    gender: 'FEMALE' | 'MALE'
    age: 'TEN' | 'TWENTY' | 'THIRTY' | 'OVER_FOURTY'
    mbtiIe: 'I' | 'E'
    mbtiTf: 'T' | 'F'
    mbti:
      | 'ISTJ'
      | 'ISFJ'
      | 'INFJ'
      | 'INTJ'
      | 'ISTP'
      | 'ISFP'
      | 'INFP'
      | 'INTP'
      | 'ESTP'
      | 'ESFP'
      | 'ENFP'
      | 'ENTP'
      | 'ESTJ'
      | 'ESFJ'
      | 'ENFJ'
      | 'ENTJ'
    role: 'USER' | 'ADMIN'
  }
}

export type UpdateMemberProfileRequest = CreateMemberProfileRequest
