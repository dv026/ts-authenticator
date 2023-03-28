import { compare, hash } from 'bcrypt'

import { tokenService } from './../services/token-service';
import { RegistrationOrLoginResponse } from '../types/user-controller';
import { IUserCredentials } from '../types/user';
import { UserAlreadyExists, UserNotFound, IncorrectPassword } from '../errors'
import { dbConnector } from '../db-connector';
import { JwtMalformed } from '../errors/jwr-malformed';

const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)

class UserController {
  constructor() {}

  async registration ({ login, password }: IUserCredentials): Promise<RegistrationOrLoginResponse> {
    try {
    const user = await dbConnector.users.findOne({ login })

    if (user !== null) {
      const error = new UserAlreadyExists()
      console.log({ UserAlreadyExists: error })
      throw error
    }

    console.log({ salt: saltRounds})
    const passwordHash = await hash(password, saltRounds)

    const added = await dbConnector.users.insertOne({
      login,
      passwordHash,
    })

    console.log({ added })

    const accessToken = tokenService.create({ user: { login }}, '1h')
    const refreshToken = tokenService.create({ user: { login }}, '24h')

    return { accessToken, refreshToken, user: {
      login
    }}
  } catch(e) {
    console.log({ newError: e })
    throw new Error(e)
  }
  }

  async login({ login, password }: IUserCredentials):  Promise<RegistrationOrLoginResponse> {
    try {
      const user = await dbConnector.users.findOne({ login })
      
      if (!user) {
        throw new UserNotFound()
      }

      const isPasswordCorrect = await compare(password, user.passwordHash)

      if (!isPasswordCorrect) {
        throw new IncorrectPassword()
      }

      const accessToken = tokenService.create({ user: { login }}, '1h')
      const refreshToken = tokenService.create({ user: { login }}, '24h')
  
      return { accessToken, refreshToken, user: {
        login
      }}
  } catch (e) {
      throw new Error(e)
    }
  }

  checkAuth(token: string) {
    try {
      return tokenService.verify(token)
    } catch (e) {
      throw new JwtMalformed()
    }
  }
}

export const userController = new UserController()