import { z } from 'zod';

const tag = z.object({
  id: z.number(),
  name: z.string(),
});
export const Pet = z.object({
  id: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  name: z.string(),
  photoUrls: z
    .string()
    .array()
    .or(z.object({ photoUrl: z.string().or(z.string().array()) })),
  tags: tag.array().or(z.object({ tag: tag }).or(tag.array())),
  status: z.string(),
});

export type Pet = z.infer<typeof Pet>;
export const Pets = z.array(Pet);
