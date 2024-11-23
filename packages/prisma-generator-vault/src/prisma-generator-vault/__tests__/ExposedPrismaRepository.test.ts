import { Prisma, PrismaClient } from "@prisma/client"
import { ExposedPrismaRepository } from "../../../test/prisma/prisma-vault"

class UserPrismaProxy extends ExposedPrismaRepository<Prisma.UserDelegate> {}

describe("prisma proxy", () => {
  let client: PrismaClient
  let proxy: UserPrismaProxy

  beforeEach(async () => {
    client = new PrismaClient()
    proxy = new UserPrismaProxy(client.user, client)
    await proxy.deleteMany({})
  })

  afterAll(async () => {
    await client.$disconnect()
  })

  it("exposes findUnique", async () => {
    const record = await proxy.create({ data: { email: "john@example.com", firstName: "John", lastName: "Example" } })
    const user = await proxy.findUnique({ where: { id: record.id }, include: { posts: true } })
    expect(user).not.toBeNull()
    expect(user?.id).toEqual(record.id)
    expect(user?.posts).toBeDefined()
  })
})
