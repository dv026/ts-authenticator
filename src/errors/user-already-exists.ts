import { USER_ALREADY_EXISTS } from "./error-codes"

export class UserAlreadyExists extends Error {
  errorCode: number

  constructor() {
    super("User Already Exists")
    this.errorCode = USER_ALREADY_EXISTS
  }
}
