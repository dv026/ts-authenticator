import { API_KET_NOT_FOUND } from "./error-codes"

export class ApiKeyNotFound extends Error {
  errorCode: number
  status: number

  constructor() {
    super("Api Key Not Found")
    this.errorCode = API_KET_NOT_FOUND
    this.status = 400
  }
}
