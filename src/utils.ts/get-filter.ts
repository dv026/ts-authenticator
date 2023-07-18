import { IQueryFilterParams } from "../types/query-filter-params"

const arrayFields = ["roles"]

export const getFilter = (queryFilterParams: IQueryFilterParams) => {
  return Object.entries(queryFilterParams)
    .filter(
      ([key, value]) =>
        key !== "pageSize" &&
        key !== "currentPage" &&
        value !== null &&
        value !== undefined
    )
    .reduce((acc, [key, value]) => {
      let operator
      if (value !== null && value !== undefined) {
        if (arrayFields.indexOf(key) > -1) {
          operator = "$in"
          value = JSON.parse(value)
        } else {
          operator = "$eq"
        }
        return {
          ...acc,
          [key]: { [operator]: value },
        }
      }

      return acc
    }, {})
}
