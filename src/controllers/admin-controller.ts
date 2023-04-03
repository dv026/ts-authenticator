import { dbConnector } from "../db-connector";
import { IFilter } from "../types/filter";



class AdminController {
  constructor() {}

  async getUsers(filter: IFilter = {
    currentPage: 1,
    elementsOnPage: 10
  }) {
    console.log({ filter })
    return await dbConnector.users
    .find()
    .skip((filter.currentPage - 1) * filter.elementsOnPage)
    .limit(filter.elementsOnPage)
    .toArray()
  }

  async getUsersCount() {
    return await dbConnector.users.estimatedDocumentCount()
  }
}

export const adminConroller = new AdminController()