import { API_KET_NOT_FOUND } from "./error-codes"

export class ApiKeyNotFound extends Error {
  errorCode: number

  constructor() {
    super("Api Key Not Found")
    this.errorCode = API_KET_NOT_FOUND
  }
}
