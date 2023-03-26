export class UserAlreadyExists extends Error {
  constructor() {
    super('User Already Exists')
    this.name = 'UserAlreadyExists'
  }
}