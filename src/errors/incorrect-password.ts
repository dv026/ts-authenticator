import { INCORRECT_PASSWORD } from "./error-codes"

export class IncorrectPassword extends Error {
  errorCode: number

  constructor() {
    super("Incorrect Password")
    this.errorCode = INCORRECT_PASSWORD
  }
}
