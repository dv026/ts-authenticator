export class IncorrectResetToken extends Error {
  constructor() {
    super("Incorrect reset token")
    this.name = "IncorrectResetToken"
  }
}
