import { z } from "zod";

export const createPostSchema = {
  body: z.strictObject({
    content:z.string().min(2).max(255).optional(),
  }),
};

