import { z } from 'zod';

export const Pet = z.object({
  id: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  name: z.string(),
  photoUrls: z.string().array(),
  tags: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
  status: z.string(),
});

export type Pet = z.infer<typeof Pet>;
export const Pets = z.array(Pet);
