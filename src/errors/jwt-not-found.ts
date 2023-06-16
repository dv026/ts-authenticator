import { JWT_NOT_FOUND } from "./error-codes"

export class JwtNotFound extends Error {
  errorCode: number

  constructor() {
    super("JWT Not Found")
    this.errorCode = JWT_NOT_FOUND
  }
}
