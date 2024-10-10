import { generatorHandler } from "./prisma-vault/generator/GeneratorHelpers.js"
import { generate } from "./prisma-vault/generator/PrismaQueryModelOptionsGenerator.js"

export type { AbstractQueryModelOptions } from "./prisma-vault/AbstractQueryModelOptions.js"

generatorHandler({
  onManifest: () => ({
    defaultOutput: "./prisma-vault/",
    prettyName: "Prisma Vault Repository Generator",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: generate,
})
