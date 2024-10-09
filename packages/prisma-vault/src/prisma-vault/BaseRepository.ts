/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "@prisma/client/runtime/library"
import type { AbstractQueryModelOptions } from "./AbstractQueryModelOptions.js"
import type { HasManyResult } from "./HasManyResult.js"
import type { IdType } from "./IdType.js"
import type { PageInfo } from "./PageInfo.js"

export abstract class BaseRepository<ModelOptions extends AbstractQueryModelOptions> {
  protected model: ModelOptions["QueryModel"]

  constructor(model: ModelOptions["QueryModel"]) {
    this.model = model
  }

  async findById<TFindOptions>({
    id,
    include,
    select,
  }: {
    id: IdType
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
  } & TFindOptions): Promise<Result<ModelOptions["QueryModel"], TFindOptions, "findFirst">> {
    return this.model
      .findFirst({ where: { id }, include, select } as {
        where: ModelOptions["WhereInput"]
        include: ModelOptions["IncludeInput"]
        select: ModelOptions["SelectInput"]
      })
      .then((result: Result<ModelOptions["QueryModel"], TFindOptions, "findFirst">) => result)
  }

  async findFirst<TFindOptions>({
    where,
    include,
    select,
  }: {
    where?: ModelOptions["WhereInput"]
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
  } & TFindOptions): Promise<Result<ModelOptions["QueryModel"], TFindOptions, "findFirst">> {
    return this.model
      .findFirst({ where, include, select })
      .then((result: Result<ModelOptions["QueryModel"], TFindOptions, "findFirst">) => result)
  }

  async findMany<TFindOptions>({
    orderBy,
    where,
    skip,
    take,
    cursor,
    include,
    select,
    checkForNextPage = true,
  }: {
    orderBy?: ModelOptions["OrderByInput"]
    where?: ModelOptions["WhereInput"]
    skip?: number
    take?: number
    cursor?: ModelOptions["WhereUniqueInput"]
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
    checkForNextPage?: boolean
  } & TFindOptions): Promise<HasManyResult<Result<ModelOptions["QueryModel"], TFindOptions, "findMany">>> {
    const nodes = await this.model
      .findMany({ orderBy, where, skip, take, cursor, include, select })
      .then((result: Result<ModelOptions["QueryModel"], TFindOptions, "findMany">) => result)

    let pageInfo: PageInfo = { hasNextPage: false }
    if (checkForNextPage) {
      const lastNode = nodes && nodes.length > 0 ? nodes[nodes.length - 1] : undefined
      if (lastNode) {
        const newCursor = { id: lastNode.id }
        const hasNextPage = await this.hasNextPage({ orderBy, where, cursor: newCursor, include, select })
        pageInfo = {
          hasNextPage,
          endCursor: [{ field: "id", value: lastNode?.id }],
        }
      }
    }

    return { nodes, pageInfo }
  }

  async hasNextPage<TFindOptions>({
    orderBy,
    where,
    cursor,
    include,
    select,
  }: {
    orderBy?: ModelOptions["OrderByInput"]
    where?: ModelOptions["WhereInput"]
    cursor?: ModelOptions["WhereUniqueInput"]
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
  } & TFindOptions): Promise<boolean> {
    const result =
      (await this.model
        .findMany({ orderBy, where, take: 1, skip: 1, cursor, include, select })
        .then((result: HasManyResult<Result<ModelOptions["QueryModel"], TFindOptions, "findMany">>) => result)) || []
    return result && result.length > 0
  }

  async create(
    args: ModelOptions["CreateInput"]
  ): Promise<Result<ModelOptions["QueryModel"], Record<string, string>, "create">> {
    let createArgs = args
    if (!args?.id && this.model.fields.id !== undefined) {
      createArgs = {
        ...createArgs,
      }
    }
    return this.model
      .create({ data: createArgs })
      .then((result: Result<ModelOptions["QueryModel"], unknown, "create">) => result)
  }

  async delete(id: IdType) {
    return this.model
      .delete({ where: { id } })
      .then((result: Result<ModelOptions["QueryModel"], unknown, "delete">) => result)
  }

  async update(
    id: IdType,
    data: Omit<ModelOptions["UpdateInput"], "id">
  ): Promise<Result<ModelOptions["QueryModel"], never, "update">> {
    return this.model
      .update({ where: { id: id }, data })
      .then((result: Result<ModelOptions["QueryModel"], unknown, "update">) => result)
  }

  async upsert(
    where: ModelOptions["WhereInput"],
    update: ModelOptions["UpdateInput"],
    create: ModelOptions["CreateInput"]
  ) {
    return this.model.upsert({ where, update, create })
  }
}
