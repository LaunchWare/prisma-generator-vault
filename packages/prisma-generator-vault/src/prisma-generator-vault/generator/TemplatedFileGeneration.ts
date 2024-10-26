import { join } from "path"
import { mkdirSync, readFileSync, writeFileSync } from "fs"
import Handlebars from "handlebars"
import { FileGenerationWithExports } from "./FileGenerationWithExports"

export abstract class TemplatedFileGeneration extends FileGenerationWithExports {
  abstract get templateParameters(): Record<string, unknown>
  abstract get templatePath(): string

  protected override writeFile() {
    const filePath = join(this.outputPath, this.fileName)
    const template = Handlebars.compile(readFileSync(this.templatePath).toString())
    const contents = template(this.templateParameters)
    mkdirSync(this.outputPath, { recursive: true })
    writeFileSync(filePath, contents, { flag: "w" })
    return filePath
  }
}
