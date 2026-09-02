import { NextFunction, Request, Response } from "express";
import { TokenTypeEnum } from "../Utils/enums/token.enum";
import { decodeToken } from "../Utils/security/token";
import { RoleEnum } from "../Utils/enums/user.enum";
import { ForbiddenException } from "../Utils/response/error.response";

export const authentication = (
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS,
) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const { user, decoded } = await decodeToken({
        authorization: req.headers.authorization,
        tokenType: tokenType,
      });
      req.user = user;
      req.decoded = decoded;
      next();
    };
};

export const authorization = (accessRole :RoleEnum[] = [])=>{
    return (req:Request, res:Response, next:NextFunction): void=>{
        if(!req.user || !accessRole.includes(req.user.role)){
            throw new ForbiddenException("Not Authorized to access this resource")
        }
        next();
    }
}
