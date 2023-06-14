export class UserNotFound extends Error {
  errorCode: number
  name: string

  constructor() {
    super("User Not Found")
    this.name = "name1"
    this.errorCode = 303
  }
}
