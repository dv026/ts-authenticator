import { ObjectId, SortDirection } from "mongodb"
import { dbConnector } from "../db-connector"
import {
  IQueryFilterParams,
  IQuerySortParams,
} from "../types/query-filter-params"
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
    },
    querySortParams: IQuerySortParams = {
      field: "login",
      direction: "descending",
    }
  ) {
    console.log("queryFilterParams", queryFilterParams)
    console.log("querySortParams", querySortParams)
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
        // TODO: temp solution
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

    const sort: { [k: string]: "descending" | "ascending" } = {
      [querySortParams?.field]: querySortParams?.direction,
    }

    console.log("filter", filter)
    console.log("sort", sort)

    return await dbConnector.users
      .find(filter)
      .skip((queryFilterParams.currentPage - 1) * queryFilterParams.pageSize)
      .limit(queryFilterParams.pageSize)
      // .sort({ login: "desc" })
      .sort(sort)
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
    login = login.toLowerCase()
    const user = dbConnector.users.findOne({ login })

    if (user) {
      throw new Error("user already exist")
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

export const adminConroller = new AdminController()
