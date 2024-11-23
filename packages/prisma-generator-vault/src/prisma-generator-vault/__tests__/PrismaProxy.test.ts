import { Prisma, PrismaClient } from "@prisma/client"
import { PrismaProxy } from "../../../test/prisma/prisma-vault"

class UserPrismaProxy extends PrismaProxy<Prisma.UserDelegate> {}

//class UserRepository extends EncapsulatedRepository<"user"> {}

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
    const record = await proxy.create({ data: { email: "jane@example.com", firstName: "Jane", lastName: "Example" } })
    const user = await proxy.findUnique({ where: { id: record.id }, include: { posts: true } })
    expect(user).not.toBeNull()
    expect(user?.id).toEqual(record.id)
  })
})
