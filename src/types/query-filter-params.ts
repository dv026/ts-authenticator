export interface IQueryFilterParams {
  currentPage?: number
  pageSize?: number
  login?: string
  roles?: string
  apiKey?: string
  sort?: {
    field: string
    direction: 'desc' | 'asc'
  }
}