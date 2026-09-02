import { JwtPayload } from "jsonwebtoken";
import { RoleEnum } from "./enums/user.enum";

export interface ITokenPayload extends JwtPayload {
  _id: string;
  role: RoleEnum;
}
export interface ISignature {
  accessSignature: string | undefined;
  refreshSignature: string | undefined;
}