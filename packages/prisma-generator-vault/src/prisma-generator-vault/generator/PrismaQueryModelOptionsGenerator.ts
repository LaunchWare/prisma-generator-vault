import { configurationSchema } from "./Configuration.js"
import { GeneratorConfig, GeneratorOptions, parseEnvValue } from "./GeneratorHelpers.js"
import fs from "fs"
import { join } from "path"

const targetProvider = "prisma-client-js"

export async function generate(options: GeneratorOptions) {
  const clientGenerator = findClientGenerator(options.otherGenerators)
  if (!clientGenerator) {
    throw new Error(`${targetProvider} is a required generator for this library`)
  }
  const importPath = resolveConfiguredImportPath(options.generator, clientGenerator)
  let interfaceFileContents = `import Prisma from "${importPath}"\n`
  interfaceFileContents += fs.readFileSync(join(__dirname, "./BaseQueryModelOptions.ts.template"))
  let outputFilePath: string | undefined
  if (!options.generator?.output?.value) {
    throw new Error("No output was specified for prisma-vault")
  }
  if (typeof options.generator?.output?.value === "string") {
    outputFilePath = options.generator.output.value
  } else {
    outputFilePath = parseEnvValue(options.generator.output)
  }
  fs.mkdirSync(outputFilePath, { recursive: true })
  fs.writeFileSync(join(outputFilePath, "BaseQueryModelOptions.ts"), interfaceFileContents)
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
