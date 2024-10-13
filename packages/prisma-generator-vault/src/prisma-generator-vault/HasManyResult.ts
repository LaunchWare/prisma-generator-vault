import { PageInfo } from "./PageInfo.js"

export interface HasManyResult<TFindManyData> {
  nodes: TFindManyData
  pageInfo?: PageInfo
}
