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

router.patch(
  "/:postId/like",
  validation(validators.postIdParamsSchema),
  postService.toggleLikePost,
);

router.patch(
  "/:postId/update",
  validation(validators.postIdParamsSchema),
  postService.updatePost,
);

router.get(
  "/:postId",
  validation(validators.postIdParamsSchema),
  postService.getSpecificPost,
);

router.delete(
  "/:postId",
  validation(validators.postIdParamsSchema),
  postService.deletePost,
);

router.post(
  "/:postId/comment",
  validation(validators.createCommentSchema),
  postService.createComments,
);

router.patch(
  "/comment/:commentId",
  validation(validators.updateCommentSchema),
  postService.updateComment,
);
router.delete(
  "/comment/:commentId",
  validation(validators.commentIdParamsSchema),
  postService.deleteComment,
);
export default router;
