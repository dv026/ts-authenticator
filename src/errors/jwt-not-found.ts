import { JWT_NOT_FOUND } from "./error-codes"

export class JwtNotFound extends Error {
  errorCode: number
  status: number

  constructor() {
    super("JWT Not Found")
    this.errorCode = JWT_NOT_FOUND
    this.status = 400
  }
}
