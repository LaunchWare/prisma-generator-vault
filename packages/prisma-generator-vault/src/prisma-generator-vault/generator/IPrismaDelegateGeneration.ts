import { join } from "path"
import { TemplatedFileGeneration } from "./TemplatedFileGeneration"

export class IPrismaDelegateFileGeneration extends TemplatedFileGeneration {
  get fileName() {
    return "IPrismaDelegate.ts"
  }

  get templatePath() {
    return join(__dirname, "./IPrismaDelegate.ts.hbs")
  }

  override generate(): string[] {
    return [this.writeFile()]
  }

  public override get exportConstants(): string[] {
    return ["IPrismaDelegate"]
  }

  public override get exportAsTypes(): boolean {
    return true
  }

  override get templateParameters(): Record<string, unknown> {
    return {}
  }
}
