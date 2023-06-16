import { JWT_MALEFORMED } from "./error-codes"

export class JwtMalformed extends Error {
  errorCode: number
  status: number

  constructor() {
    super("JWT Mafformed")
    this.errorCode = JWT_MALEFORMED
    this.status = 400
  }
}
