import { USER_NOT_FOUND } from "./error-codes"

export class UserNotFound extends Error {
  errorCode: number
  errorMessage: string

  constructor() {
    super("User Not Found")
    this.errorCode = USER_NOT_FOUND
    this.errorMessage = "User not found"
  }
}
