import { INCORRECT_RESET_TOKEN } from "./error-codes"

export class IncorrectResetToken extends Error {
  errorCode: number

  constructor() {
    super("Incorrect Reset Token")
    this.errorCode = INCORRECT_RESET_TOKEN
  }
}
