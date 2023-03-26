import jwt from 'jsonwebtoken'

// TODO: use process.env
const jwtSecret = process.env.JWT_SECRET

class TokenService {
  constructor() {}

  verify(token: string) {
    return jwt.verify(token, jwtSecret)
  }

  create(payload: any, expiresIn: string | number) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn,
    })
  }
}

export const tokenService = new TokenService()