export interface IQueryFilterParamsUser {
  currentPage?: number
  pageSize?: number
  searchQuery?: string
  roles?: string[]
  apiKey?: string
}

export interface IQueryFilterParamsApiKeys {
  currentPage?: number
  pageSize?: number
  searchQuery?: string
  userId: string
}

export type TSortDirection = "descending" | "ascending"
export interface IQuerySortParams {
  field: string
  direction: TSortDirection
}
