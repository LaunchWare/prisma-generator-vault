# PrismaVault

An implementation of the repository pattern for Prisma.

## Why PrismaVault?

PrismaVault aims to address a common issue in larger codebases: the tendency of database logic to become scattered throughout the application. Prisma’s API, while powerful, can lead to data access being spread across multiple layers and components, increasing the risk of tight coupling between your service layer and data layer.

PrismaVault takes a different approach by centralizing database operations within well-defined repository classes, encouraging a clean separation of concerns. By encapsulating data logic, PrismaVault reduces the direct dependency of your application’s core logic on Prisma, instead favoring reusable repository methods that interact with Prisma under the hood.

## Philosophy

The philosophy behind PrismaVault is to reduce coupling between the data and service layers by:

0. **Obfuscating Direct Prisma Calls**: By abstracting the Prisma API into protected or exposed repository methods, you control the specific data operations each service layer can perform. This layer of abstraction limits the direct exposure to Prisma, making it easier to refactor the data layer without affecting service logic.
1. **Returning Translated Entities**: Repository methods return “translated” entities or specific data transfer objects (DTOs), rather than raw Prisma records. This encourages the development of standardized interfaces between the data and service layers, further decoupling them and creating a flexible application architecture.
2. **Encouraging Centralized Data Access**: Instead of scattering database logic across the app, PrismaVault allows you to consolidate database operations in repository classes. This reduces repetition, minimizes the risk of inconsistent data access patterns, and centralizes optimizations or transactional logic.

## Overview of Generated Classes

PrismaVault generates two types of repository base classes you can extend, each with a different philosophy of encapsulation:

### Recommended: `EncapsulatedPrismaRepository`

This abstract class provides **protected methods** for interacting with Prisma, designed to prevent direct access to the Prisma API outside of the repository. This encapsulated approach promotes clear and focused repository methods, where only high-level, well-defined operations are exposed to the service layer.

```typescript
import { Prisma, PrismaClient } from "@prisma/client";
import { EncapsulatedPrismaRepository } from "../../../test/prisma/prisma-vault";

class UserRepository extends EncapsulatedPrismaRepository<Prisma.UserDelegate> {
  async findById(id: string) {
    return this.findUnique({ where: { id } });
  }
}

const client = new PrismaClient();
const repository = new UserRepository(client.user, client);
const user = await repository.findById("123453");
console.log(user.id);
```

### `ExposedPrismaRepository`

This abstract class exposes the Prisma API through **public methods**, allowing more direct access to Prisma functionality. While this provides flexibility, it is considered a "leaky" abstraction, as it exposes the full Prisma API surface area. This approach may be suitable for simpler applications where complete encapsulation is not required but centralized data logic is still desired.

```typescript
import { Prisma, PrismaClient } from "@prisma/client";
import { ExposedPrismaRepository } from "../../../test/prisma/prisma-vault";

class UserRepository extends ExposedPrismaRepository<Prisma.UserDelegate> {}

const client = new PrismaClient();
const repository = new UserRepository(client.user, client);
const user = await repository.findUnique({ where: { id: "123453" } });
console.log(user.id);
```

Both approaches encourage the implementation of high-level, centralized methods for complex and transactional operations, keeping database logic organized and consistent.

## Installation

To install PrismaVault, use:

```bash
pnpm add prisma-generator-vault
```

## Configuration

To configure PrismaVault, add the following to your Prisma schema file:

```prisma
generator prismaVault {
  provider = "prisma-generator-vault"
}
```

Optional configuration options include:

- **`output`**: Specifies the directory where PrismaVault will generate artifacts, including base repository classes. By default, files are generated into a directory within the `prisma` folder.
- **`importPath`**: If your Prisma client is generated in a non-default location, adjust this path to point to the correct client location instead of `@prisma/client`.

## Generate Artifacts

Run the following command to generate the required artifacts for PrismaVault:

```bash
pnpm prisma generate
```

This will generate the necessary files to simplify the creation of new Prisma-based repositories and provide an encapsulated data access layer.

## Benefits of PrismaVault

0. **Reduced Coupling**: By centralizing database access logic, PrismaVault minimizes dependencies between service and data layers, enhancing the flexibility and maintainability of your application.
1. **Easier Refactoring**: Abstracted repository classes make it easier to modify data access logic or migrate databases without requiring changes across multiple application components.
2. **Centralized Data Logic**: Consistently implemented repository methods ensure that complex logic, such as transactions or data transformations, is handled in one place, reducing redundancy and the risk of errors.

With PrismaVault, you gain the ability to control data interactions in a structured and scalable way, making your codebase more resilient and adaptable.

