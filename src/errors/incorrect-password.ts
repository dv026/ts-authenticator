import { INCORRECT_PASSWORD } from "./error-codes"

export class IncorrectPassword extends Error {
  errorCode: number
  status: number

  constructor() {
    super("Incorrect Password")
    this.errorCode = INCORRECT_PASSWORD
    this.status = 400
  }
}
