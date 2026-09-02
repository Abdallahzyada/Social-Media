import { Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../response/error.response";

export const fileValidation = {
  images: ["image/png", "image/jpg", "image/gif", "image/jpeg", "image/pjpeg"],
};

const uploadDir = resolve("./uploads");

export const localFileUpload = ({
  folder = "general",
  maxSizeMB = 5,
  validation = fileValidation.images,
}: { folder?: string; maxSizeMB?: number; validation?: string[] } = {}) => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const destPath = resolve(uploadDir, folder);
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }

      cb(null, destPath);
    },

    filename: (req: Request, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}_${randomUUID()}.${ext}`);
    },
  });

  const extToMime: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    pjpeg: "image/pjpeg",
  };

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    let { mimetype } = file;

    // Fallback: if mimetype is generic, infer from extension
    if (mimetype === "application/octet-stream") {
      const ext = file.originalname.split(".").pop()?.toLowerCase() ?? "";
      mimetype = extToMime[ext] ?? mimetype;
    }

    if (!validation.includes(mimetype)) {
      return cb(
        new BadRequestException(`Invalid File Format: ${file.mimetype}`),
      );
    }
    cb(null, true);
  };
  return multer({
    storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
