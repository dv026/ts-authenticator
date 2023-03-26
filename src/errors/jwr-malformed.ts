export class JwtMalformed extends Error {
  constructor() {
    super('jwr mafformed')
    this.name = 'JwtMalformed'
  }
}