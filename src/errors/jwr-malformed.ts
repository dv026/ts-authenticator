import { JWT_MALEFORMED } from "./error-codes"

export class JwtMalformed extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("JWT Mafformed")
    this.errorCode = JWT_MALEFORMED
    this.errorMessage = "JWT Mafformed"
  }
}
