import { Prisma, PrismaClient } from "@prisma/client"
import { PrismaProxy } from "../../../test/prisma/prisma-vault"

class UserPrismaProxy extends PrismaProxy<Prisma.UserDelegate> {}

//class UserRepository extends EncapsulatedRepository<"user"> {}

const client = new PrismaClient()
const proxy = new UserPrismaProxy(client.user, client)

describe("prisma proxy", () => {
  beforeEach(async () => {
    await proxy.deleteMany({})
  })

  it("exposes findUnique", async () => {
    const record = await proxy.create({ data: { email: "john@example.com", firstName: "John", lastName: "Example" } })
    const user = await proxy.findUnique({ where: { id: record.id }, include: { posts: true } })
    expect(user).not.toBeNull()
    expect(user?.id).toEqual(record.id)
  })
})
