import { USER_ALREADY_EXISTS } from "./error-codes"

export class UserAlreadyExists extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("User Already Exists")
    this.errorCode = USER_ALREADY_EXISTS
    this.errorMessage = "User Already Exists"
  }
}
