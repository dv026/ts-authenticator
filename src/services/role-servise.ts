import { dbConnector } from '../db-connector'

class RoleService {
  constructor() {}

  async get(filter: Record<string, string | number | boolean> = {}) {
    return dbConnector.roles.find(filter)
  }

  async getOne(filter: Record<string, string | number | boolean> = {}) {
    return dbConnector.roles.findOne(filter)
  }
}

export const roleService = new RoleService()