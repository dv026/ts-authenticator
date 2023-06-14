import { ObjectId } from "mongodb"
import { dbConnector } from "../db-connector"
import randomstring from "randomstring"

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

  async getAll(userId: string) {
    return dbConnector.apiKeys.find({ userId }).toArray()
  }

  async deleteMany(ids: string[]) {
    const objectIds = ids.map((id) => new ObjectId(id))
    return await dbConnector.users.deleteMany({ _id: { $in: objectIds } })
  }
}

export const apiKeysConroller = new ApiKeysController()
