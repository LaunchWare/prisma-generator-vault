import { join } from "path"
import { TemplatedFileGeneration } from "./TemplatedFileGeneration"

export class ExposedPrismaRepositoryGeneration extends TemplatedFileGeneration {
  get fileName() {
    return "ExposedPrismaRepository.ts"
  }

  get templatePath() {
    return join(__dirname, "./ExposedPrismaRepository.ts.hbs")
  }

  override generate(): string[] {
    return [this.writeFile()]
  }

  public override get exportConstants(): string[] {
    return ["ExposedPrismaRepository"]
  }

  override get templateParameters(): Record<string, unknown> {
    return {}
  }
}
