import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve("./config/div.env") });

export const env = {
  PORT: Number(process.env.PORT) || 80,
  MODE: process.env.MODE || "DEVELOPMENT",
  APPLICATION_NAME: process.env.APPLICATION_NAME || "SOCIAL_MEDIA",

  MONGO_URI: process.env.MONGO_URI as string,
  SALT: process.env.SALT || 12,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,

  ACCESS_ADMIN_SIGNATURE: process.env.ACCESS_ADMIN_SIGNATURE as string,
  ACCESS_USER_SIGNATURE: process.env.ACCESS_USER_SIGNATURE as string,

  REFRESH_ADMIN_SIGNATURE: process.env.REFRESH_ADMIN_SIGNATURE as string,
  REFRESH_USER_SIGNATURE: process.env.REFRESH_USER_SIGNATURE as string,

  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 3600,
  REFRESH_TOKEN_EXPIRES_IN:
    Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 604800,

  REFRESH_TOKEN_REMEMBER_ME_EXPIRES_IN:
    Number(process.env.REFRESH_TOKEN_REMEMBER_ME_EXPIRES_IN) || 2592000,
  CLIENT_ID: process.env.CLIENT_ID as string,

  ENC_KEY: process.env.ENC_KEY as string,
  WHITE_LIST: process.env.WHITE_LIST as string,
};

export type Env = typeof env;
