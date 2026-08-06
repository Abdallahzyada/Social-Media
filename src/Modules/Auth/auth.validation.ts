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

export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid Email" }),
    otp: z.string({ error: "OTP  Missing" }).regex(/^\d{6}$/),
  }),
};

export const forgetPasswordSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid Email" }),
  }),
};

export const resetPasswordSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid Email" }),
    otp: z.string({ error: "OTP  Missing" }).regex(/^\d{6}$/),
    newPassword: z
      .string({ error: "Required password" })
      .min(8, { error: "Password must be longer than 8 character" })
      .max(40, { error: "password can't be longer than 40 character" }),
  }),
};

export const signUpSchema = {
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
