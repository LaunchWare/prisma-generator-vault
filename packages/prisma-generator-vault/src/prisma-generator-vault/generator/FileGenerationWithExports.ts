import { FileGeneration } from "./FileGeneration";

export abstract class FileGenerationWithExports extends FileGeneration {
  static exportConstants: string[]

  public abstract get exportConstants(): string[]

  public get exportAsTypes() {
    return false
  }
}
