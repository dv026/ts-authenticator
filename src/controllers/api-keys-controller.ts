import { ObjectId } from "mongodb"
import { dbConnector } from "../db-connector"
import randomstring from "randomstring"
import {
  IQueryFilterParamsApiKeys,
  IQuerySortParams,
} from "../types/query-filter-params"
import { getFilter } from "../utils.ts/get-filter"

class ApiKeysController {
  constructor() {}

  async get(id: string) {
    return dbConnector.apiKeys.findOne({ _id: new ObjectId(id) })
  }

  async delete(id: string) {
    return dbConnector.apiKeys.deleteOne({ _id: new ObjectId(id) })
  }

  async update(id: string, name: string) {
    return dbConnector.apiKeys.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name } }
    )
  }

  async create(name: string, userId: string) {
    const apiKey = randomstring.generate(24)
    return dbConnector.apiKeys.insertOne({ name, value: apiKey, userId })
  }

  // async getAll(userId: string) {
  //   return dbConnector.apiKeys.find({ userId }).toArray()
  // }

  async getList(
    queryFilterParams: IQueryFilterParamsApiKeys = {
      currentPage: 1,
      pageSize: 10,
      searchQuery: null,
      userId: "",
    },
    querySortParams: IQuerySortParams = {
      field: "login",
      direction: "ascending",
    }
  ) {
    const sort: { [k: string]: "descending" | "ascending" } = {
      [querySortParams?.field]: querySortParams?.direction,
    }

    const filter = getFilter<IQueryFilterParamsApiKeys>(
      queryFilterParams,
      "name"
    )

    console.log("filter", filter)

    return await dbConnector.apiKeys
      .find(filter)
      .skip((queryFilterParams.currentPage - 1) * queryFilterParams.pageSize)
      .limit(queryFilterParams.pageSize)
      .sort(sort)
      .toArray()
  }

  async getApiKeysCount(queryFilterParams: IQueryFilterParamsApiKeys) {
    const filter = getFilter(queryFilterParams)

    return await dbConnector.apiKeys.countDocuments(filter)
  }

  async deleteMany(ids: string[]) {
    const objectIds = ids.map((id) => new ObjectId(id))
    return await dbConnector.users.deleteMany({ _id: { $in: objectIds } })
  }
}

export const apiKeysConroller = new ApiKeysController()
