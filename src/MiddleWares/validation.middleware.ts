import { z } from "zod";
import type { ZodError, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../Utils/response/error.response";

type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;
export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{ message: string; path:( string | Number | symbol)[] }>;
    }> = [];
    for (const key of Object.keys(schema) as KeyReqType[]) {
      const keySchema = schema[key];
      if (!keySchema) continue;
      const validationResult = keySchema.safeParse(req[key]);
      if (!validationResult.success) {
        validationErrors.push({
          key,
          issues: validationResult.error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        });
      }
      continue;
    }
    if (validationErrors.length > 0) {
      throw new BadRequestException("Validation error", {
        cause: validationErrors,
      });
    }
  };
};
