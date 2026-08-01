import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/config.service";
import { corsOptions } from "./Utils/cors/cors";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import {
  globalErrorHandler,
  NotFoundException,
} from "./Utils/response/error.response";

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  statusCode: 429,
  message: "Too Many Requests",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
export const bootstrap = async (): Promise<void> => {
  const app: Express = express();

  app.use(express.json(), limiter);
  app.use(helmet());
  app.use(cors(corsOptions));

  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: `Welcome to ${env.APPLICATION_NAME}!` });
  });

  app.use((req: Request, res: Response) => {
    throw new NotFoundException("Route Not found!");
  });

  app.use(globalErrorHandler);

  app.listen(env.PORT, () => {
    console.log(`http://127.0.0.1:${env.PORT}`);
  });
};
