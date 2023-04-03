import { dbConnector } from "../db-connector";
import { IFilter } from "../types/filter";



class AdminController {
  constructor() {}

  async getUsers(filter: IFilter = {
    currentPage: 1,
    elementsOnPage: 10
  }) {
    return await dbConnector.users
    .find()
    .skip((filter.currentPage - 1) * filter.elementsOnPage)
    .limit(filter.elementsOnPage)
    .toArray()
  }
}

export const adminConroller = new AdminController()