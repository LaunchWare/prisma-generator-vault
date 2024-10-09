import { AbstractQueryModelOptions } from "../AbstractQueryModelOptions.js"
import { BaseRepository } from "../BaseRepository.js"
import { Prisma, PrismaClient } from "@prisma/client"

export interface BaseQueryModelOptions<TQueryModel> extends AbstractQueryModelOptions {
  QueryModel: TQueryModel
  CreateInput?: Omit<Prisma.Args<TQueryModel, "create">["data"], "id">
  UpdateInput?: Prisma.Args<TQueryModel, "update">["data"]
  WhereInput?: Prisma.Args<TQueryModel, "findMany">["where"]
  WhereUniqueInput?: Prisma.Args<TQueryModel, "update">["where"]
  OrderByInput?: Prisma.Args<TQueryModel, "findMany">["orderBy"]
  IncludeInput?: Prisma.Args<TQueryModel, "findMany">["include"] | null
  SelectInput?: Prisma.Args<TQueryModel, "findMany">["select"] | null
  InstancePayload: Prisma.Payload<TQueryModel, "findFirst">
}

type UserQueryModelOptions = BaseQueryModelOptions<Prisma.UserDelegate>
class UserRepository extends BaseRepository<UserQueryModelOptions> {}

const prisma = new PrismaClient()
const userRepository = new UserRepository(prisma.user)

const createUser = async () => {
  return await userRepository.create({
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
  })
}
describe("Base Repository", () => {
  beforeEach(async () => {
    await prisma.$queryRaw`DELETE FROM User;`
  })

  it("creates a record", async () => {
    const user = await createUser()
    expect(user.id).toBeDefined()
  })

  it("deletes a record", async () => {
    const user = await createUser()

    userRepository.delete(user.id)

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser).toBe(null)
  })

  it("finds a record that exists", async () => {
    const user = await createUser()

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser).not.toBeNull()
    expect(foundUser?.id).toEqual(user.id)
  })

  it("updates a record", async () => {
    const user = await createUser()
    await userRepository.update(user.id, {
      firstName: "Jim",
    })

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser?.firstName).toEqual("Jim")
  })
})
