export class UserNotFound extends Error {
  constructor() {
    super('User Not Found')
    this.name = 'UserNotFoundError'
  }
}