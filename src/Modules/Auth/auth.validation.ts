import { z } from "zod";

export const loginSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid Email" }),
    password: z
      .string({ error: "Required password" })
      .min(8, { error: "Password must be longer than 8 character" })
      .max(40, { error: "password can't be longer than 40 character" }),
  }),
};

export const singUpSchema = {
  body: loginSchema.body
    .extend({
      username: z
        .string({ error: "User name is Required" })
        .min(2, { error: "Username must be longer than 2 character" })
        .max(25, { error: "username can't be longer than 25 character" }),
      confirmPassword: z
        .string({ error: "Required password" })
        .min(8, { error: "Password must be longer than 8 character" })
        .max(40, { error: "Password can't be longer than 40 character" }),
      otp: z.string().regex(/^\d{6}$/),
      role: z.enum(["USER", "ADMIN"]).default("USER"),
      gender: z.enum(["MALE", "FEMALE"]),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "password missmatch",
        });
      }
    }),
};
