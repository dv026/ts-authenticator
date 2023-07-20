import { ObjectId, SortDirection } from "mongodb"
import { dbConnector } from "../db-connector"
import {
  IQueryFilterParamsUser,
  IQuerySortParams,
} from "../types/query-filter-params"
import { passwordService } from "../services/password-service"
import { getFilter } from "../utils.ts/get-filter"

class UserController {
  constructor() {}

  async getList(
    queryFilterParams: IQueryFilterParamsUser = {
      currentPage: 1,
      pageSize: 10,
      roles: [],
      searchQuery: null,
      apiKey: null,
    },
    querySortParams: IQuerySortParams = {
      field: "login",
      direction: "ascending",
    }
  ) {
    const sort: { [k: string]: "descending" | "ascending" } = {
      [querySortParams?.field]: querySortParams?.direction,
    }

    const filter = getFilter(queryFilterParams)

    return await dbConnector.users
      .find(filter)
      .skip((queryFilterParams.currentPage - 1) * queryFilterParams.pageSize)
      .limit(queryFilterParams.pageSize)
      .sort(sort)
      .toArray()
  }

  async getUsersCount(queryFilterParams: IQueryFilterParamsUser) {
    const filter = getFilter(queryFilterParams, "login")

    return await dbConnector.users.countDocuments(filter)
  }

  async deleteUser(id: string) {
    return await dbConnector.users.deleteOne({ _id: new ObjectId(id) })
  }

  async getUser(id: string) {
    return dbConnector.users.findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    )
  }

  async deleteUsers(ids: string[]) {
    const objectIds = ids.map((id) => new ObjectId(id))
    return await dbConnector.users.deleteMany({ _id: { $in: objectIds } })
  }

  async createUser({ login, password, roles, apiKey }) {
    login = login.toLowerCase()
    const user = await dbConnector.users.findOne({ login })

    if (user) {
      throw new Error("user already exists")
    }

    const passwordHash = await passwordService.hash(password)
    await dbConnector.users.insertOne({ login, passwordHash, roles, apiKey })
  }

  async updateUser({ id, login, password, roles }) {
    login = login.toLowerCase()
    const passwordHash = await passwordService.hash(password)
    return dbConnector.users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { login, passwordHash, roles } }
    )
  }
}

export const userController = new UserController()
