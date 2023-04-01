export class JwtMalformed extends Error {
  constructor(message?: string) {
    super('jwr mafformed' + message && ' ' + message)
    this.name = 'JwtMalformed'
  }
}