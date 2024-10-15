import { readFileSync } from "fs"
import { join } from "path"
import { FileGenerationWithExports } from "./FileGenerationWithExports"

export class BaseQueryModelOptionsGeneration extends FileGenerationWithExports {
  static override fileName: string = "BaseQueryModelOptions.ts"
  static override exportConstants: string[] = ["BaseQueryModelOptions"]

  get fileName() {
    return BaseQueryModelOptionsGeneration.fileName
  }

  public override get exportConstants(): string[] {
    return BaseQueryModelOptionsGeneration.exportConstants
  }

  override generate(): string[] {
    const interfaceFileContents = readFileSync(join(__dirname, "./BaseQueryModelOptions.ts.template")).toString()
    return [this.writeFile(interfaceFileContents)]
  }

  public override get exportAsTypes(): boolean {
    return true
  }
}
