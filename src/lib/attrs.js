import { z } from "zod";

const Schema = z.object({
  GroupId: z.string(),
  Variant: z.string(),
  Title: z.string().max(50),
  Description: z.string().max(200),
  Topics: z.array(z.string()),
  Authors: z.array(z.string().min(43).max(43)),
  Type: z.string().default("spec"),
  Forks: z.string().optional(),
});

export const validateAttrs = (tags) => Schema.parseAsync(tags);
