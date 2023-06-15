import { API_KET_NOT_FOUND } from "./error-codes"

export class ApiKeyNotFound extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("Api Key Not Found")
    this.errorCode = API_KET_NOT_FOUND
    this.errorMessage = "Api Key Not Found"
  }
}
