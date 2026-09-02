import { ITokenPayload } from "../Utils/interface";
import { IUser } from "../DB/Models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      decoded?: ITokenPayload;
    }
  }
}

export {};
