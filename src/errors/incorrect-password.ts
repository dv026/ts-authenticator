import { INCORRECT_PASSWORD } from "./error-codes"

export class IncorrectPassword extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("Incorrect Password")
    this.errorCode = INCORRECT_PASSWORD
    this.errorMessage = "Incorrect Password"
  }
}
