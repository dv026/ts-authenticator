import { dbConnector } from "../db-connector"

class RoleController {
  constructor() {}

  async get(filter: Record<string, string> = {}) {
    return dbConnector.roles.find(filter)
  }
}

export const roleConroller = new RoleController()
