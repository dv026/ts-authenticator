export interface IUser {
  login: string
  password: string
}

export interface IUserCredentials {
  login: string
  password: string
  apiKey: string
  createdDate?: number
}
