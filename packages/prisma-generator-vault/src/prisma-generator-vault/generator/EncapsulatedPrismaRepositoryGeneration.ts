import { join } from "path"
import { TemplatedFileGeneration } from "./TemplatedFileGeneration"

export class EncapsulatedPrismaRepositoryGeneration extends TemplatedFileGeneration {
  get fileName() {
    return "EncapsulatedPrismaRepository.ts"
  }

  get templatePath() {
    return join(__dirname, "./EncapsulatedPrismaRepository.ts.hbs")
  }

  public override get exportConstants(): string[] {
    return ["EncapsulatedPrismaRepository"]
  }

  override generate(): string[] {
    return [this.writeFile()]
  }

  override get templateParameters(): Record<string, unknown> {
    return {}
  }
}
