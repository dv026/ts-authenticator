export class UserNotFound extends Error {
  errorCode: number
  name: string

  constructor() {
    super("User Not Found")
    this.errorCode = 303
  }
}
