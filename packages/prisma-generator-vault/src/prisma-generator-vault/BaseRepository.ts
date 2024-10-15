/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AbstractQueryModelOptions } from "./AbstractQueryModelOptions.js"
import type { HasManyResult } from "./HasManyResult.js"
import type { IdType } from "./IdType.js"
import type { PageInfo } from "./PageInfo.js"

export abstract class BaseRepository<ModelOptions extends AbstractQueryModelOptions> {
  protected model: ModelOptions["QueryModel"]

  constructor(model: ModelOptions["QueryModel"]) {
    this.model = model
  }

  async findById({
    id,
    include,
    select,
  }: {
    id: IdType
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
  }): Promise<ModelOptions["FindFirstResult"]> {
    return this.model
      .findFirst({ where: { id }, include, select } as {
        where: ModelOptions["WhereInput"]
        include: ModelOptions["IncludeInput"]
        select: ModelOptions["SelectInput"]
      })
      .then((result: ModelOptions["FindFirstResult"]) => result)
  }

  async findFirst({
    where,
    include,
    select,
    orderBy,
  }: {
    where?: ModelOptions["WhereInput"]
    include?: ModelOptions["IncludeInput"]
    select?: ModelOptions["SelectInput"]
    orderBy?: ModelOptions["OrderByInput"]
  }): Promise<ModelOptions["FindFirstResult"]> {
    return this.model
      .findFirst({ where, include, select, orderBy })
      .then((result: ModelOptions["FindFirstResult"]) => result)
  }

  async findMany({
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
  }): Promise<HasManyResult<ModelOptions["FindManyResult"]>> {
    const nodes = await this.model
      .findMany({ orderBy, where, skip, take, cursor, include, select })
      .then((result: ModelOptions["FindManyResult"]) => result)

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

  async hasNextPage({
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
  }): Promise<boolean> {
    const result =
      (await this.model
        .findMany({ orderBy, where, take: 1, skip: 1, cursor, include, select })
        .then((result: HasManyResult<ModelOptions["FindManyResult"]>) => result)) || []
    return result && result.length > 0
  }

  async create(args: ModelOptions["CreateInput"]): Promise<ModelOptions["CreateResult"]> {
    return this.model.create({ data: args }).then((result: ModelOptions["CreateResult"]) => result)
  }

  async deleteById(id: IdType) {
    return this.model.delete({ where: { id } }).then((result: ModelOptions["DeleteResult"]) => result)
  }

  async updateById(id: IdType, data: Omit<ModelOptions["UpdateInput"], "id">): Promise<ModelOptions["UpdateResult"]> {
    return this.model.update({ where: { id: id }, data }).then((result: ModelOptions["UpdateResult"]) => result)
  }

  async upsert(
    where: ModelOptions["WhereInput"],
    update: ModelOptions["UpdateInput"],
    create: ModelOptions["CreateInput"]
  ): Promise<ModelOptions["UpsertResult"]> {
    return this.model.upsert({ where, update, create }).then((result: ModelOptions["UpsertResult"]) => result)
  }
}
