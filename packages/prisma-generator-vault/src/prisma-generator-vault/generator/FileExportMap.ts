type FileExportMapValue = {
  exportConstants: string[]
  exportAsTypes: boolean
}

export type FileExportMap = Record<string, FileExportMapValue>
