import crypto from "node:crypto";
import { env } from "../../config/config.service";

const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY: Buffer = Buffer.from(env.ENC_KEY, "utf-8");

export const encrypt = (text: string): string => {
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    iv,
  );
  let encryptData: string = cipher.update(text, "utf-8", "hex");
  encryptData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptData}`;
};

export const decrypt = (encryptData: string): string => {
  const [ivHex, encryptedText] = encryptData.split(":");
  if (!ivHex || !encryptedText) {
    throw new Error("Invalid encrypted data format");
  }
  const binaryLikeIv = Buffer.from(ivHex, "hex");

  const decypher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    binaryLikeIv,
  );
  let decryptData:string = decypher.update(encryptedText, "hex", "utf-8");
  decryptData += decypher.final("utf-8");
  return decryptData;
};
