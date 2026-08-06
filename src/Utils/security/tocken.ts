import { Secret, sign, SignOptions } from "jsonwebtoken";
import { HUserDocument } from "../../DB/Models/user.model";
import { RoleEnum } from "../enums/user.enum";
import { env } from "../../config/config.service";

export const generateToken = ({
  payload,
  secret,
  options,
}: {
  payload: Object;
  secret: Secret;
  options: SignOptions;
}) => {
  return sign(payload, secret, options);
};

export const createLoginCredentials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const isAdmin = user.role === RoleEnum.ADMIN;
  const accessSecret = isAdmin
    ? env.ACCESS_ADMIN_SIGNATURE
    : env.ACCESS_USER_SIGNATURE;
  const refreshSecret = isAdmin
    ? env.REFRESH_ADMIN_SIGNATURE
    : env.REFRESH_USER_SIGNATURE;

  const accessToken = generateToken({
    payload: { _id: user._id },
    secret: accessSecret,
    options: { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN },
  });

  const refreshToken = generateToken({
    payload: { _id: user._id },
    secret: refreshSecret,
    options: { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN },
  });

  return { accessToken, refreshToken };
};
