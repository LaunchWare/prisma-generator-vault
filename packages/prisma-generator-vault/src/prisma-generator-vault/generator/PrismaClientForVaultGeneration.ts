import { FileGenerationOptions } from "./FileGeneration"
import { FileGenerationWithExports } from "./FileGenerationWithExports"

type PrismaClientForVaultGenerationOptions = {
  importPath: string
} & FileGenerationOptions

export class PrismaClientForVaultGeneration extends FileGenerationWithExports {
  private importPath: string
  static override fileName: string = "PrismaClientForVault.ts"
  static override exportConstants: string[] = ["Prisma", "PrismaClient", "PrismaPromise"]

  constructor({ outputPath, importPath }: PrismaClientForVaultGenerationOptions) {
    super({ outputPath })
    this.importPath = importPath
  }

  override generate(): string[] {
    const contents = `export type { ${this.exportConstants.join(", ")} } from "${this.importPath}"`
    return [this.writeFile(contents)]
  }

  protected get fileName() {
    return PrismaClientForVaultGeneration.fileName
  }

  public override get exportConstants(): string[] {
    return PrismaClientForVaultGeneration.exportConstants
  }

  public override get exportAsTypes(): boolean {
    return true
  }
}
