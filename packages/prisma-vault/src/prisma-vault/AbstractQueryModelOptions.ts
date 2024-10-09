/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AbstractQueryModelOptions {
  QueryModel?: any
  CreateInput?: Record<string, any>
  UpdateInput?: Record<string, any>
  WhereInput?: Record<string, any>
  WhereUniqueInput?: Record<any, any>
  OrderByInput?: Record<string, any>
  IncludeInput?: Record<string, any> | null
  SelectInput?: Record<string, any> | null
  InstancePayload: Record<string, any>
}
