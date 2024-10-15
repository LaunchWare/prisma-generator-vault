export { BaseRepository } from "./prisma-generator-vault/BaseRepository.js"
import { generatorHandler } from "./prisma-generator-vault/generator/GeneratorHelpers.js"
import { generate } from "./prisma-generator-vault/generator/PrismaVaultGenerator.js"

export type { AbstractQueryModelOptions } from "./prisma-generator-vault/AbstractQueryModelOptions.js"
export type { HasManyResult } from "./prisma-generator-vault/HasManyResult.js"
export type { IdType } from "./prisma-generator-vault/IdType.js"
export type { PageInfo } from "./prisma-generator-vault/PageInfo.js"

generatorHandler({
  onManifest: () => ({
    defaultOutput: "./prisma-vault/",
    prettyName: "Prisma Vault Repository Generator",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: generate,
})
