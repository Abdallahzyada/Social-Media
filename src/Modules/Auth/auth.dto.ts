import { z } from "zod";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "./auth.validation";

export type ISingUpDTO = z.infer<typeof signUpSchema.body>;
export type IConfrimEmailDTO = z.infer<typeof confirmEmailSchema.body>;
export type ILoginDTO = z.infer<typeof loginSchema.body>;
export type IForgetPasswordDTO = z.infer<typeof forgetPasswordSchema.body>;
export type IResetPasswordDTO = z.infer<typeof resetPasswordSchema.body>;
