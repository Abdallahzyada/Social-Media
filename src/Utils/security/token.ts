import { Secret, sign, SignOptions, verify } from "jsonwebtoken";
import { HUserDocument, userModel } from "../../DB/Models/user.model";
import { RoleEnum } from "../enums/user.enum";
import { env } from "../../config/config.service";
import { TokenTypeEnum } from "../enums/token.enum";
import {
  NotFoundException,
  UnauthorizedException,
} from "../response/error.response";
import { SignatureEnum } from "../enums/signature.enums";
import { ITokenPayload } from "../interface";


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

export const verifyToken = ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: Secret;
}): ITokenPayload => {
  return verify(token, secretKey) as ITokenPayload;
};

export const getSignature = (
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS,
  signatureLevel: SignatureEnum = SignatureEnum.USER,
): string => {
  const isAdmin = signatureLevel === SignatureEnum.ADMIN;
  if (tokenType === TokenTypeEnum.REFRESH) {
    return isAdmin ? env.REFRESH_ADMIN_SIGNATURE : env.REFRESH_USER_SIGNATURE;
  }
  return isAdmin ? env.ACCESS_ADMIN_SIGNATURE : env.ACCESS_USER_SIGNATURE;
};

export const createLoginCredentials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const payload = { _id: user._id.toString(), role: user.role };

  const isAdmin = user.role === RoleEnum.ADMIN;
  const accessSecret = isAdmin
    ? env.ACCESS_ADMIN_SIGNATURE
    : env.ACCESS_USER_SIGNATURE;
  const refreshSecret = isAdmin
    ? env.REFRESH_ADMIN_SIGNATURE
    : env.REFRESH_USER_SIGNATURE;

  const accessToken = generateToken({
    payload,
    secret: accessSecret,
    options: { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN },
  });

  const refreshToken = generateToken({
    payload,
    secret: refreshSecret,
    options: { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN },
  });

  return { accessToken, refreshToken };
};

export const decodeToken = async ({
  authorization,
  tokenType = TokenTypeEnum.ACCESS,
}: {
  authorization: string | undefined;
  tokenType?: TokenTypeEnum;
}): Promise<{ user: HUserDocument; decoded: ITokenPayload }> => {
  if (!authorization) {
    throw new UnauthorizedException("Missing authrization header!");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new UnauthorizedException("Invalid authrization format");
  }
  let decoded: ITokenPayload;
  try {
    decoded = verifyToken({
      token,
      secretKey: getSignature(tokenType, SignatureEnum.USER),
    });
  } catch {
    try {
      decoded = verifyToken({
        token,
        secretKey: getSignature(tokenType, SignatureEnum.ADMIN),
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
  if (!decoded._id) {
    throw new UnauthorizedException("Invalid token payload");
  }

  const user = await userModel.findById(decoded._id);
  if (!user) {
    throw new NotFoundException("Account Not Found !");
  }

  if (user.freezedAt) {
    throw new UnauthorizedException("Account freezed");
  }
  if (
    user.changeCredentialsTime &&
    decoded.iat &&
    user.changeCredentialsTime.getTime() > decoded.iat * 1000
  ) {
    throw new UnauthorizedException("Session expired!");
  }
  return { user, decoded };
};
