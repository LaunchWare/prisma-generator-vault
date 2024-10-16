import { configurationSchema } from "./Configuration.js"
import { GeneratorConfig, GeneratorOptions, parseEnvValue } from "./GeneratorHelpers.js"
import { PrismaClientForVaultGeneration } from "./PrismaClientForVaultGeneration.js"
import { EnvValue } from "@prisma/generator-helper"
import { BaseQueryModelOptionsGeneration } from "./BaseQueryModelGeneration.js"
import { PrismaVaultRepositoryGeneration } from "./PrismaVaultRepositoryGeneration.js"
import { IndexGeneration } from "./IndexGeneration.js"
import { existsSync, rmSync } from "fs"

const targetProvider = "prisma-client-js"

export async function generate(options: GeneratorOptions) {
  const clientGenerator = findClientGenerator(options.otherGenerators)
  if (!clientGenerator) {
    throw new Error(`${targetProvider} is a required generator for this library`)
  }
  const importPath = resolveConfiguredImportPath(options.generator, clientGenerator)
  const outputPath = resolveOutputPath(options.generator?.output)
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true })
  }
  const generators = [
    new PrismaClientForVaultGeneration({ outputPath, importPath }),
    new BaseQueryModelOptionsGeneration({ outputPath }),
    new PrismaVaultRepositoryGeneration({ outputPath }),
  ]

  const fileExportMap = generators.reduce((fileManifest, generator) => {
    const filePath = generator.generate().at(0)
    if (!filePath) {
      throw new Error("File path not returned from generate")
    }
    return {
      ...fileManifest,
      [filePath]: {
        exportConstants: generator.exportConstants,
        exportAsTypes: generator.exportAsTypes,
      },
    }
  }, {})

  const indexGeneration = new IndexGeneration({ outputPath, fileExportMap })
  indexGeneration.generate()
}

function resolveOutputPath(output: EnvValue | null) {
  if (!output?.value) {
    throw new Error("No output was specified for prisma-vault")
  }
  if (typeof output?.value === "string") {
    return output.value
  } else {
    return parseEnvValue(output)
  }
}

function resolveConfiguredImportPath(generator: GeneratorConfig, clientGenerator: GeneratorConfig) {
  const configParse = configurationSchema.safeParse(generator.config)
  if (!configParse.success) {
    throw new Error("Invalid options for prisma vault")
  }
  const { importPath } = configParse.data
  if (importPath) {
    return importPath
  } else {
    if (clientGenerator.output && clientGenerator.output.value) {
      return clientGenerator.output.value.replace(/.*node_modules\//, "")
    } else {
      return "@prisma/client"
    }
  }
}

function findClientGenerator(otherGenerators: GeneratorConfig[]) {
  const clientGenerator = otherGenerators.find(generator => {
    return generator.provider.value === targetProvider
  })
  if (clientGenerator) {
    return clientGenerator
  } else {
    return null
  }
}