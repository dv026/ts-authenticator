import { IQueryFilterParamsUser } from "../types/query-filter-params"

const arrayFields = ["roles"]

export const getFilter = <T>(
  queryFilterParams: T,
  searchFieldName?: string
) => {
  return Object.entries(queryFilterParams)
    .filter(
      ([key, value]) =>
        key !== "pageSize" &&
        key !== "currentPage" &&
        value !== null &&
        value !== undefined
    )
    .reduce((acc, [key, value]) => {
      let operator = "$eq"
      if (value !== null && value !== undefined) {
        if (arrayFields.indexOf(key) > -1) {
          operator = "$in"
          value = JSON.parse(value)
        } else {
          if (key === "searchQuery") {
            operator = "$regex"
          }
        }

        const fieldName = key === "searchQuery" ? searchFieldName : key

        return {
          ...acc,
          [fieldName]: { [operator]: value },
        }
      }

      return acc
    }, {})
}
