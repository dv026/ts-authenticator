export interface RegistrationOrLoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    login: string
    roles: string[]
  }
}