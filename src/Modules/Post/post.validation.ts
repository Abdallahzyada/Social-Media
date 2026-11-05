import { z } from "zod";

export const createPostSchema = {
  body: z.strictObject({
    content: z.string().min(2).max(255).optional(),
  }),
};
export const postIdParamsSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid format"),
  }),
};
export const updatePostSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid format"),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(3000),
  }),
};

export const createCommentSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid format"),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(5000),
    parentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "invalid format")
      .optional(),
  }),
};
export const updateCommentSchema = {
  params: z.strictObject({
    commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid format"),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(5000),
  }),
};
export const commentIdParamsSchema = {
  params: z.strictObject({
    commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid format"),
  })
};
