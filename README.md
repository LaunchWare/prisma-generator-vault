# PrismaVault

An implementation of the repository pattern for Prisma

## Why?

We like all of our database logic centralized. Prisma encourages spreading database logic throughout the application. This library encourages centralizaing your database operations.

While we expose an abstract query model, this implementation intentionally exposes some of prisma's API at the repository layer. Should you someday want to migrate off of prisma, you could theoretically create a new class that adheres to the `BaseRepository` contract, but that is not a primary motivator.

The library provides a baseline of basic CRUD operations common to all database models, but the classes that inherit off of `PrismaVaultRepository` are intended to be a starting point for all of your database operations. You should be liberal with creating new instance methods in your children of `PrismaVaultRepository`.

## Installing

```
pnpm add prisma-generator-vault
```

## Configuring

Add the following your prisma schema:

```
generator prismaVault {
  provider = "node prisma-generator-vault"
}
```

You can optionally provide the following:

- **output** - the directory where you want `prisma-generator-vault` artifacts to be generated into. For now, this generates a set of files that simplifies creating new prisma-based repositories.
- **importPath** - if you generate your prisma client into a nondefault location, you can adjust the import path here to be something different from `@prisma/client`.

## Generate

```
pnpm prisma generate
```

This will generate the required artifacts for `prisma-generator-vault` to improve it's usability.

## Creating Your First Repository

```typescript
import { PrismaVaultRepository } from "prisma-generator-vault"
// import this file according to where your prisma schema and supporting files are generated
import { BaseQueryModelOptions } from "./prisma/prisma-vault/BaseQueryModelOptions.js"
import { Prisma, PrismaClient } from "@prisma/client"

type UserQueryModelOptions = BaseQueryModelOptions<Prisma.UserDelegate>
class UserRepository extends PrismaVaultRepository<UserQueryModelOptions> {}
```

## Using Your Repository

`prisma-generator-vault` provides coherent `findById`, `findFirst`, `findMany`, `update`, `create`, `upsert`, and `deleteById` methods to manipulate data in a specific table.

```typescript
import { PrismaClient } from "@prisma/client"

type UserQueryModelOptions = BaseQueryModelOptions<Prisma.UserDelegate>
class UserRepository extends PrismaVaultRepository<UserQueryModelOptions> {}

const prisma = new PrismaClient()

const userRepository = new UserRepository(prisma.user)
const user = await userRepository.create({
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
})
const foundUser = await userRepository.findById({ id: user.id })

const updatedUser = await userRepository.updateById(foundUser.id, { email: "john.smith@example.com" })

const deletedUser = await userRepository.deleteById(updatedUser.id)
```

You're strongly encouraged to implement new methods for more complex and transactional database operations.

