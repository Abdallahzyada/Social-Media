import { Router } from "express";
import authService from "./auth.service";
import * as validators from "./auth.validation";
import { validation } from "../../MiddleWares/validation.middleware";

const router = Router();

router.post("/signup", validation(validators.signUpSchema), authService.signUp);
router.patch("/confirm-email", validation(validators.confirmEmailSchema), authService.confirmEmail);
router.post("/login", validation(validators.loginSchema), authService.login);
router.patch("/forget-password", validation(validators.forgetPasswordSchema), authService.forgetPassword);
router.patch("/reset-password", validation(validators.resetPasswordSchema), authService.resetPassword);
router.post("/social-login", authService.loginWithGoogle);
export default router;
