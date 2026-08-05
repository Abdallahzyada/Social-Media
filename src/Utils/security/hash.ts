import { compare, hash } from "bcrypt";
import { env } from "../../config/config.service";

export const generateHash = async (
  plainText: string,
  saltRound: number = Number(env.SALT),
): Promise<string> => {
  return await hash(plainText, saltRound);
};


export const compareHash = async (
  plainText: string,
  hashValue: string,
): Promise<boolean> => {
  return await compare(plainText, hashValue);
};