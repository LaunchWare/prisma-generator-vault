import { basename } from "path"
import { FileGeneration, FileGenerationOptions } from "./FileGeneration"
import { FileExportMap } from "./FileExportMap"

type IndexGenerationOptions = {
  fileExportMap: FileExportMap
} & FileGenerationOptions

export class IndexGeneration extends FileGeneration {
  private fileExportMap: FileExportMap
  static override fileName: string = "index.ts"

  constructor({ fileExportMap, outputPath }: IndexGenerationOptions) {
    super({ outputPath })
    this.fileExportMap = fileExportMap
  }
  override generate(): string[] {
    const exportLines = Object.keys(this.fileExportMap).map(filePath => {
      const { exportAsTypes, exportConstants } = this.fileExportMap[filePath]
      return `export ${exportAsTypes ? "type " : ""}{ ${exportConstants.join(", ")} } from "./${basename(
        filePath
      ).replace(/\.ts$/, ".js")}"`
    })
    this.writeFile(exportLines.join("\n"))
    return [this.fileName]
  }

  protected override get fileName(): string {
    return IndexGeneration.fileName
  }
}
