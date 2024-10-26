import { join } from "path"
import { TemplatedFileGeneration } from "./TemplatedFileGeneration"

export class PrismaProxyGeneration extends TemplatedFileGeneration {
  get fileName() {
    return "PrismaProxy.ts"
  }

  get templatePath() {
    return join(__dirname, "./PrismaProxy.ts.hbs")
  }

  override generate(): string[] {
    return [this.writeFile()]
  }

  public override get exportConstants(): string[] {
    return ["PrismaProxy"]
  }

  override get templateParameters(): Record<string, unknown> {
    return {}
  }
}
