/* eslint-disable @typescript-eslint/no-explicit-any */
type RecordType = Record<string, any>
export interface AbstractQueryModelOptions {
  QueryModel?: any
  CreateInput?: RecordType
  UpdateInput?: RecordType
  WhereInput?: RecordType
  WhereUniqueInput?: Record<any, any>
  OrderByInput?: RecordType
  IncludeInput?: RecordType | null
  SelectInput?: RecordType | null
  FindFirstResult: RecordType | null
  FindManyResult: RecordType[]
  CreateResult: RecordType
  UpdateResult: RecordType
  UpsertResult: RecordType
  DeleteResult: RecordType
}
