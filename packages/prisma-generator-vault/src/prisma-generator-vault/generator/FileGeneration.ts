import { mkdirSync, writeFileSync } from "fs"
import { join } from "path"

export type FileGenerationOptions = {
  outputPath: string
}

export abstract class FileGeneration {
  protected outputPath: string
  static fileName: string

  constructor({ outputPath }: FileGenerationOptions) {
    this.outputPath = outputPath
  }

  abstract generate(): string[]
  protected abstract get fileName(): string

  protected writeFile(contents: string) {
    const filePath = join(this.outputPath, this.fileName)
    mkdirSync(this.outputPath, { recursive: true })
    writeFileSync(filePath, contents, { flag: "w" })
    return filePath
  }
}
