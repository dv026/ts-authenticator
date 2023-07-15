import { ObjectId } from "mongodb"
import { dbConnector } from "../db-connector"
import { IQueryFilterParams } from "../types/query-filter-params"
import { passwordService } from "../services/password-service"

class AdminController {
  constructor() {}

  async getUsers(
    queryFilterParams: IQueryFilterParams = {
      currentPage: 1,
      pageSize: 10,
      roles: "",
      login: "",
      apiKey: "",
      sort: {
        field: "login",
        direction: "asc",
      },
    }
  ) {
    console.log("queryFilterParams", queryFilterParams)
    const filter: any = Object.entries(queryFilterParams)
      .filter(
        ([key, value]) =>
          key !== "pageSize" &&
          key !== "currentPage" &&
          value !== null &&
          value !== undefined
      )
      .reduce((acc, [key, value]) => {
        let operator
        if (key === "roles") {
          operator = "$in"
          value = JSON.parse(value)
        } else {
          operator = "$eq"
        }
        return {
          ...acc,
          [key]: { [operator]: value },
        }
      }, {})

    const sort = {
      // [queryFilterParams?.sort?.field]: queryFilterParams?.sort?.direction,
      ["login"]: "desc",
    }

    console.log("filter", filter)

    return await dbConnector.users
      .find(filter)
      .skip((queryFilterParams.currentPage - 1) * queryFilterParams.pageSize)
      .limit(queryFilterParams.pageSize)
      // .sort(sort)
      .toArray()
  }

  async getUsersCount() {
    return await dbConnector.users.estimatedDocumentCount()
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
    const passwordHash = await passwordService.hash(password)
    await dbConnector.users.insertOne({ login, passwordHash, roles, apiKey })
  }

  async updateUser({ id, login, password, roles }) {
    const passwordHash = await passwordService.hash(password)
    return dbConnector.users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { login, passwordHash, roles } }
    )
  }
}

export const adminConroller = new AdminController()
