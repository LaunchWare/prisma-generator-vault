import { readFileSync } from "fs";
import { join } from "path";
import { FileGenerationWithExports } from "./FileGenerationWithExports.js";

export class PrismaVaultRepositoryGeneration extends FileGenerationWithExports {
  static override fileName: string = "PrismaVaultRepository.ts"
  static override exportConstants: string[] = ["PrismaVaultRepository"]

  override generate(): string[] {
    const contents = readFileSync(join(__dirname, "./PrismaVaultRepository.ts.template")).toString()
    return [this.writeFile(contents)]
  }

  protected override get fileName(): string {
    return PrismaVaultRepositoryGeneration.fileName
  }

  public override get exportConstants(): string[] {
    return PrismaVaultRepositoryGeneration.exportConstants
  }
}
