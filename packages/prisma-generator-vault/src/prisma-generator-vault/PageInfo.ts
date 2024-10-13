export interface PageInfo {
  hasNextPage: boolean
  endCursor?: {
    field: string
    value: string
  }[]
}
