import { Router } from "express";
import postService from "./post.service";
import * as validators from "./post.validation";
import { validation } from "../../MiddleWares/validation.middleware";
import { authentication } from "../../MiddleWares/authentication.middlewares";
import {
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer";

const router = Router();
router.use(authentication());

router.post(
  "/",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.createPostSchema),
  postService.createPost,
);
export default router;
