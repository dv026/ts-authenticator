import { API_KET_NOT_PROVIDED } from "./error-codes"

export class ApiKeyNotProvided extends Error {
  errorCode: number
  status: number

  constructor() {
    super("ApiKeyNotProvided")
    this.errorCode = API_KET_NOT_PROVIDED
    this.status = 400
  }
}
