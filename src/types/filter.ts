export interface IFilter {
  currentPage?: number
  pageSize?: number
  filter?: Record<string, (string | number | boolean)[] | null>
}