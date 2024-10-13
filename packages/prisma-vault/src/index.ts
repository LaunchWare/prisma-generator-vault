export { BaseRepository } from "./prisma-vault/BaseRepository.js"
import { generatorHandler } from "./prisma-vault/generator/GeneratorHelpers.js"
import { generate } from "./prisma-vault/generator/PrismaQueryModelOptionsGenerator.js"

export type { AbstractQueryModelOptions } from "./prisma-vault/AbstractQueryModelOptions.js"
export type { HasManyResult } from "./prisma-vault/HasManyResult.js"
export type { IdType } from "./prisma-vault/IdType.js"
export type { PageInfo } from "./prisma-vault/PageInfo.js"

generatorHandler({
  onManifest: () => ({
    defaultOutput: "./prisma-vault/",
    prettyName: "Prisma Vault Repository Generator",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: generate,
})
