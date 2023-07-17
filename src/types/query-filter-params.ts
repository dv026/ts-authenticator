export interface IQueryFilterParams {
  currentPage?: number
  pageSize?: number
  login?: string
  roles?: string
  apiKey?: string
}

export type TSortDirection = "descending" | "ascending"
export interface IQuerySortParams {
  field: string
  direction: TSortDirection
}
