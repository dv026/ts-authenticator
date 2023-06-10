import { emailService } from './../services/email-service';

import { tokenService } from './../services/token-service';
import { RegistrationOrLoginResponse } from '../types/user-controller';
import { IUserCredentials } from '../types/user';
import { UserAlreadyExists, UserNotFound, IncorrectPassword } from '../errors'
import { dbConnector } from '../db-connector';
import { JwtMalformed } from '../errors/jwr-malformed';
import { passwordService } from '../services/password-service';
import { ObjectId } from 'mongodb';
import { createResetLink } from '../utils.ts/get-reset-link';
import { roleService } from '../services/role-servise';
import base64 from 'base-64'
import { apiKeyService } from '../services/api-key-service';

class UserController {
  constructor() {}

  async registration ({ login, password, apiKey }: IUserCredentials): Promise<RegistrationOrLoginResponse> {
    try {
      const user = await dbConnector.users.findOne({ login })

      if (user !== null) {
        console.log('error 1')
        throw new UserAlreadyExists()
      }

      const passwordHash = await passwordService.hash(password)

      const defaultRole = await roleService.getOne({ isDefault: true })

      const userRoles = [defaultRole.name]

      if (!apiKeyService.checkApiKey(apiKey)) {
        throw new Error('API Key does not exist')
      }

      const newUser = await dbConnector.users.insertOne({
        login,
        passwordHash,
        roles: userRoles,
        apiKey,
      })

      const accessToken = tokenService.create({ user: { login, _id: newUser.insertedId }}, '1h')
      const refreshToken = tokenService.create({ user: { login, _id: newUser.insertedId }}, '24h')

      return { accessToken, refreshToken, user: {
        login,
        roles: userRoles,
        _id: newUser.insertedId.toString()
      }}
    } catch(e) {
      console.log('error 2')
      throw new Error(e)
    }
  }

  async login({ login, password }: IUserCredentials):  Promise<RegistrationOrLoginResponse> {
    try {
      const user = await dbConnector.users.findOne({ login })
      
      if (!user) {
        throw new UserNotFound()
      }

      const isPasswordCorrect = await passwordService.compare(password, user.passwordHash)

      if (!isPasswordCorrect) {
        throw new IncorrectPassword()
      }

      const accessToken = tokenService.create({ user: { login, _id: user._id }}, '1h')
      const refreshToken = tokenService.create({ user: { login, _id: user._id }}, '24h')
  
      return { accessToken, refreshToken, user: {
        login,
        roles: user.roles,
        _id: user._id.toString()
      }}
  } catch (e) {
      throw new Error(e)
    }
  }

  async changePassword({ login, oldPassword, newPassword }) {
    try {
      const user = await dbConnector.users.findOne({ login })

      const compareResult = passwordService.compare(oldPassword, user.passwordHash)
      if (compareResult) {
        const newPasswordHash = await passwordService.hash(newPassword)

        await dbConnector.users.updateOne({ login }, {
          $set: {
            passwordHash: newPasswordHash
          }
        })
      }

      return
    } catch (e) {
      throw new Error(e)
    }
  }

  async forgotPassword({ login }) {
    try {
      const user = await dbConnector.users.findOne({ login })

      if (user === null) {
        throw new UserNotFound()
      }

      const userId = user._id.toString()

      await dbConnector.tokens.deleteMany({ userId })
      const token = tokenService.create({ userId: userId }, '1h')
      const base64Token = base64.encode(token)
      const resetLink = createResetLink(base64Token)

      await dbConnector.tokens.insertOne({ userId, token: base64Token })

      return emailService.send({
        to: login,
        subject: 'Reset Password',
        text: `To reset your password follow this link - ${resetLink}`
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  async resetPassword({ token, newPassword }: { token: string, newPassword: string }) {
    try {
      const decodedToken = base64.decode(token)
      const { userId } = tokenService.verify(decodedToken) as { userId: string }

      const tokenEntity = await dbConnector.tokens.findOne({ userId, token })

      if (tokenEntity.token === token) {
        const passwordHash = await passwordService.hash(newPassword)
        await dbConnector.tokens.deleteMany({ userId })
        return await dbConnector.users.updateOne({ "_id": new ObjectId(userId)}, {
          $set: {
            passwordHash
          }
          })
      }
      throw new Error()
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