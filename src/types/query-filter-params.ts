export interface IQueryFilterParams {
  currentPage?: number
  pageSize?: number
  login?: string
  roles?: string
  apiKey?: string
}

export interface IQuerySortParams {
  field: string
  direction: "desc" | "asc"
}
