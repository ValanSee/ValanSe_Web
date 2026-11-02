export type LoginResponse = {
  id: string
  accessToken: string
  refreshToken: string
}

/** POST /auth/apple/login 요청. 앱(네이티브)은 redirectUri 없이, 웹(Apple JS)은 authorize 에 쓴 값을 함께 보낸다 */
export type AppleLoginRequest = {
  identityToken: string
  authorizationCode: string
  redirectUri?: string
  /** Apple 은 최초 동의 때만 이름을 준다 */
  name?: string
}

export type ReissueResponse = {
  accessToken: string
}
