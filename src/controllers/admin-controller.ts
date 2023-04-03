import { dbConnector } from "../db-connector";
import { IFilter } from "../types/filter";



class AdminController {
  constructor() {}

  async getUsers(filter: IFilter = {
    currentPage: 1,
    pageSize: 10
  }) {
    console.log({ filter })
    return await dbConnector.users
    .find()
    .skip((filter.currentPage - 1) * filter.pageSize)
    .limit(filter.pageSize)
    .toArray()
  }

  async getUsersCount() {
    return await dbConnector.users.estimatedDocumentCount()
  }
}

export const adminConroller = new AdminController()