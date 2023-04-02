import { dbConnector } from "../db-connector";

class AdminController {
  constructor() {}

  async getUsers(filter: Record<string, string> = {}) {
    return await dbConnector.users.find(filter).toArray()
  }
}

export const adminConroller = new AdminController()