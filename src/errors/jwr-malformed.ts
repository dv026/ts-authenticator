import { JWT_MALEFORMED } from "./error-codes"

export class JwtMalformed extends Error {
  errorCode: number

  constructor() {
    super("JWT Mafformed")
    this.errorCode = JWT_MALEFORMED
  }
}
