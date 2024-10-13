import { z } from "zod"

export const configurationSchema = z.object({
  importPath: z.string().optional(),
})

export type Configuration = z.infer<typeof configurationSchema>
