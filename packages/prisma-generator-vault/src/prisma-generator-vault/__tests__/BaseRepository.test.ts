import { BaseRepository } from "../BaseRepository.js"
import { BaseQueryModelOptions } from "../../../test/prisma/prisma-vault/BaseQueryModelOptions.js"
import { Prisma, PrismaClient } from "@prisma/client"

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

    userRepository.deleteById(user.id)

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser).toBe(null)
  })

  it("finds a record that exists", async () => {
    const user = await createUser()

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser).not.toBeNull()
    expect(foundUser?.id).toEqual(user.id)
  })

  it("finds first on the basis of a constraint", async () => {
    const user = await createUser()

    const foundUser = await userRepository.findFirst({ where: { email: user.email } })
    expect(foundUser).not.toBeNull()
    expect(foundUser?.id).toEqual(user.id)
  })

  it("updates a record", async () => {
    const user = await createUser()
    await userRepository.updateById(user.id, {
      firstName: "Jim",
    })

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser?.firstName).toEqual("Jim")
  })

  it("paginates", async () => {
    await createUser()
    const secondUser = await userRepository.create({
      firstName: "John",
      lastName: "Snow",
      email: "john2@example.com",
    })

    await userRepository.create({
      firstName: "Ariya",
      lastName: "Stark",
      email: "ariya@example.com",
    })

    const constrainedSet = await userRepository.findMany({ take: 2 })
    expect(constrainedSet.nodes.length).toEqual(2)
    expect(constrainedSet.pageInfo?.endCursor[0].value).toEqual(secondUser.id)
  })

  it("upserts updates", async () => {
    const user = await createUser()
    const updatedUser = await userRepository.upsert(
      { id: user.id },
      { lastName: "Snow" },
      { email: "johnSnow@example.com", firstName: "John", lastName: "Snow" }
    )
    expect(updatedUser.id).toEqual(user.id)
    expect(updatedUser.lastName).toEqual("Snow")
  })

  it("upserts inserts", async () => {
    const updatedUser = await userRepository.upsert(
      { email: "xzafasdfaqs@example.com" },
      { lastName: "Snow" },
      { email: "johnSnow@example.com", firstName: "John", lastName: "Snow" }
    )
    expect(updatedUser.id).toBeDefined()
    expect(updatedUser.lastName).toEqual("Snow")
  })

  it("finds many records", async () => {
    await createUser()
    await userRepository.create({
      firstName: "John",
      lastName: "Snow",
      email: "john2@example.com",
    })

    await userRepository.create({
      firstName: "Ariya",
      lastName: "Stark",
      email: "ariya@example.com",
    })

    const results = await userRepository.findMany({})
    expect(results.nodes.length).toEqual(3)
  })
})
