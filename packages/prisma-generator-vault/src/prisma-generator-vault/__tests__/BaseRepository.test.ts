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

  it("updates a record", async () => {
    const user = await createUser()
    await userRepository.updateById(user.id, {
      firstName: "Jim",
    })

    const foundUser = await userRepository.findById({ id: user.id })
    expect(foundUser?.firstName).toEqual("Jim")
  })
})
