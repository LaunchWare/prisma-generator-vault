#!/usr/bin/env node

import { generatorHandler } from "@prisma/generator-helper"
import { generate } from "./prisma-generator-vault/generator/PrismaVaultGenerator"

generatorHandler({
  onManifest: () => ({ prettyName: "Prisma Vault Generator", defaultOutput: "./prisma-vault" }),
  onGenerate: generate,
})
