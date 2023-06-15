import { API_KET_NOT_PROVIDED } from "./error-codes"

export class ApiKeyNotProvided extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("ApiKeyNotProvided")
    this.errorCode = API_KET_NOT_PROVIDED
    this.errorMessage = "API Key Not Provided"
  }
}
