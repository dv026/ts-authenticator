export interface UserModel {
  login: string
  passwordHash: string
  roles: string[]
  apiKey: string
  createdDate: number
}
