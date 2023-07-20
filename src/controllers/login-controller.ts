import { ObjectId } from "mongodb"
import base64 from "base-64"

import { emailService } from "../services/email-service"
import { tokenService } from "../services/token-service"
import { RegistrationOrLoginResponse } from "../types/user-controller"
import { IUserCredentials } from "../types/user"
import { UserAlreadyExists, UserNotFound, IncorrectPassword } from "../errors"
import { dbConnector } from "../db-connector"
import { JwtMalformed } from "../errors/jwr-malformed"
import { passwordService } from "../services/password-service"
import { createResetLink } from "../utils.ts/get-reset-link"
import { roleService } from "../services/role-servise"
import { apiKeyService } from "../services/api-key-service"
import { ApiKeyNotFound } from "../errors/api-key-not-found"
import { IncorrectResetToken } from "../errors/incorrect-reset-token"

class LoginController {
  constructor() {}

  async registration({
    login,
    password,
    apiKey,
  }: IUserCredentials): Promise<RegistrationOrLoginResponse> {
    login = login.toLocaleLowerCase()
    const user = await dbConnector.users.findOne({ login })

    if (user !== null) {
      throw new UserAlreadyExists()
    }

    const passwordHash = await passwordService.hash(password)

    const defaultRole = await roleService.getOne({ isDefault: true })

    const userRoles = [defaultRole.name]

    if (!apiKeyService.checkApiKey(apiKey)) {
      throw new ApiKeyNotFound()
    }

    const newUser = await dbConnector.users.insertOne({
      login,
      passwordHash,
      roles: userRoles,
      apiKey,
    })

    const accessToken = tokenService.create(
      { user: { login, _id: newUser.insertedId } },
      "1h"
    )
    const refreshToken = tokenService.create(
      { user: { login, _id: newUser.insertedId } },
      "24h"
    )

    return {
      accessToken,
      refreshToken,
      user: {
        login,
        roles: userRoles,
        _id: newUser.insertedId.toString(),
      },
    }
  }

  async login({
    login,
    password,
  }: IUserCredentials): Promise<RegistrationOrLoginResponse> {
    login = login.toLocaleLowerCase()
    const user = await dbConnector.users.findOne({ login })

    if (user === null) {
      throw new UserNotFound()
    }

    const isPasswordCorrect = await passwordService.compare(
      password,
      user.passwordHash
    )

    if (!isPasswordCorrect) {
      throw new IncorrectPassword()
    }

    const accessToken = tokenService.create(
      { user: { login, _id: user._id } },
      "1h"
    )
    const refreshToken = tokenService.create(
      { user: { login, _id: user._id } },
      "24h"
    )

    return {
      accessToken,
      refreshToken,
      user: {
        login,
        roles: user.roles,
        _id: user._id.toString(),
      },
    }
  }

  async changePassword({ login, oldPassword, newPassword }) {
    login = login.toLocaleLowerCase()
    const user = await dbConnector.users.findOne({ login })

    if (user === null) {
      throw new UserNotFound()
    }

    const isPasswordsEqual = passwordService.compare(
      oldPassword,
      user.passwordHash
    )

    if (!isPasswordsEqual) {
      throw new IncorrectPassword()
    }

    const newPasswordHash = await passwordService.hash(newPassword)

    await dbConnector.users.updateOne(
      { login },
      {
        $set: {
          passwordHash: newPasswordHash,
        },
      }
    )
  }

  async forgotPassword({ login }) {
    login = login.toLocaleLowerCase()
    const user = await dbConnector.users.findOne({ login })

    if (user === null) {
      throw new UserNotFound()
    }

    const userId = user._id.toString()

    await dbConnector.tokens.deleteMany({ userId })
    const token = tokenService.create({ userId: userId }, "1h")
    const base64Token = base64.encode(token)
    const resetLink = createResetLink(base64Token)

    await dbConnector.tokens.insertOne({ userId, token: base64Token })

    return emailService.send({
      to: login,
      subject: "Reset Password",
      text: `To reset your password follow this link - ${resetLink}`,
    })
  }

  async resetPassword({
    token,
    newPassword,
  }: {
    token: string
    newPassword: string
  }) {
    const decodedToken = base64.decode(token)
    const { userId } = tokenService.verify(decodedToken) as {
      userId: string
    }

    const tokenEntity = await dbConnector.tokens.findOne({ userId, token })

    if (tokenEntity.token === token) {
      throw new IncorrectResetToken()
    }

    const passwordHash = await passwordService.hash(newPassword)
    await dbConnector.tokens.deleteMany({ userId })
    return await dbConnector.users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          passwordHash,
        },
      }
    )
  }

  checkAuth(token: string) {
    try {
      return tokenService.verify(token)
    } catch (e) {
      throw new JwtMalformed()
    }
  }
}

export const loginController = new LoginController()
