import { Request, Response } from "express";
import {
  IConfrimEmailDTO,
  IForgetPasswordDTO,
  ILoginDTO,
  IResetPasswordDTO,
  ISingUpDTO,
} from "./auth.dto";
import { userModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { generateOTP } from "../../Utils/generateOTP";
import { compareHash, generateHash } from "../../Utils/security/hash";
import { emailEvents } from "../../Utils/events/email.events";
import { createLoginCredentials } from "../../Utils/security/token";
import { ProviderEnum } from "../../Utils/enums/provider.enum";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/config.service";

class AuthService {
  constructor() { }
  signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, email, password }: ISingUpDTO = req.body;

      const checkUserExists = await userModel
        .findOne({ email })
        .select("email");
      if (checkUserExists) throw new ConflictException("User Already Exists");
      const otp = generateOTP();

      const [user] = await userModel.create(
        [
          {
            email,
            username,
            password,
            confirmEmailOTP: await generateHash(otp),
          },
        ],
        { validateBeforeSave: true },
      );
      emailEvents.emit("confirmEmail", {
        to: email,
        username,
        otp,
      });
      return res.status(201).json({ message: "Done", user });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp }: IConfrimEmailDTO = req.body;

      const user = await userModel.findOne({
        email,
        confirmEmailOTP: { $exists: true },
        confirmedAt: { $exists: false },
      });

      if (!user || !user.confirmEmailOTP)
        throw new NotFoundException("Invalid account!");
      if (!(await compareHash(otp, user.confirmEmailOTP)))
        throw new BadRequestException("Invalid OTP");
      await userModel.updateOne(
        { email },
        {
          confirmedAt: new Date(),
          $unset: { confirmEmailOTP: true },
          $inc: { __v: 1 },
        },
      );
      return res.status(200).json({ message: "Done" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password }: ILoginDTO = req.body;

      const user = await userModel.findOne({
        email,
        confirmedAt: { $exists: true },
      });

      if (!user) throw new NotFoundException("Invalid account!");
      if (!(await compareHash(password, user.password)))
        throw new BadRequestException("Invalid Password");
      const credintial = createLoginCredentials(user);
      return res.status(200).json({ message: "Done", credintial });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };

  forgetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email }: IForgetPasswordDTO = req.body;
      const otp = await generateOTP();
      const hashOtp = await generateHash(String(otp));

      const user = await userModel.findOneAndUpdate(
        {
          email,
          confirmedAt: { $exists: true },
          provider: ProviderEnum.SYSTEM,
        },
        { forgetPasswordOTP: hashOtp },
      );

      if (!user) throw new NotFoundException("Invalid account!");
      emailEvents.emit("forgetPassword", {
        to: email,
        username: user.firstName,
        otp,
      });

      return res.status(200).json({ message: "OTP sent to your account" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp, newPassword }: IResetPasswordDTO = req.body;

      const user = await userModel.findOne({
        email,
        confirmedAt: { $exists: true },
        provider: ProviderEnum.SYSTEM,
        forgetPasswordOTP: { $exists: true },
      });

      if (!user || !user.forgetPasswordOTP)
        throw new NotFoundException("Invalid account!");
      const isValidOTP = await compareHash(otp, user.forgetPasswordOTP);

      if (!isValidOTP) throw new BadRequestException("Invalid OTP");

      await userModel.updateOne({ email }, {
        password: await generateHash(newPassword),
        $inc: { __v: 1 },
        $unset: { forgetPasswordOTP: true }
      })

      return res.status(200).json({ message: "Password Updated" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };

  loginWithGoogle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idToken } = req.body;
      if (!idToken) throw new BadRequestException("Missing Google ID token");

      const client = new OAuth2Client(env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email)
        throw new BadRequestException("Invalid Google token");

      let user = await userModel.findOne({ email: payload.email });

      if (!user) {
        const [created] = await userModel.create(
          [
            {
              email: payload.email,
              firstName: payload.given_name || "User",
              lastName: payload.family_name || "",
              password: await generateHash(generateOTP() + Date.now()),
              provider: ProviderEnum.GOOGLE,
              confirmedAt: new Date(),
            },
          ],
          { validateBeforeSave: true },
        );
        if (!created) throw new BadRequestException("Failed to create user");
        user = created;
      }

      const credential = createLoginCredentials(user);
      return res.status(200).json({ message: "Done", credential });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  };
}

export default new AuthService();
