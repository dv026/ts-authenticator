import bcrypt, { compare, hash } from 'bcrypt'
import { tokenService } from "./token-service"

const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)

class PasswordService {
  constructor() {}

  async hash(password: string) {
    return hash(password, saltRounds)
  }

  async compare(firstPasswordHash: string, secondPasswordHash: string) {
    return compare(firstPasswordHash, secondPasswordHash)
  }
}

export const passwordService = new PasswordService()