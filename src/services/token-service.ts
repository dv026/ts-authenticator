import jwt from 'jsonwebtoken'

// TODO: use process.env
const jwtHash = 'hash'

class TokenService {
  constructor() {}

  verify(token: string) {
    return jwt.verify(token, jwtHash)
  }

  create(payload: any, expiresIn: string | number) {
    return jwt.sign(payload, jwtHash, {
      expiresIn,
    })
  }
}

export const tokenService = new TokenService()