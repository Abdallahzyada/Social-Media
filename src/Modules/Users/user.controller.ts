import { Router } from "express";
import { authentication } from "../../MiddleWares/authentication.middlewares";
import { validation } from "../../MiddleWares/validation.middleware";
import * as validators from "./user.validation";
import userService from "./user.service";

const router = Router();

router.use(authentication());

router.post(
  "/friend-request/:userId",
  validation(validators.userIdParamsSchema),
  userService.sendFrindRequest,
);

router.get("/friend-request", userService.listFriendRequs);

router.patch(
  "/friend-request/:requestId/accept",
  validation(validators.requestIdParamsSchema),
  userService.acceptFriendRequest,
);

router.delete(
  "/friend-request/:requestId/reject",
  validation(validators.requestIdParamsSchema),
  userService.rejectFriendRequest,
);

router.delete(
  "/friend/:userId",
  validation(validators.userIdParamsSchema),
  userService.removeFriend,
);

router.patch(
  "/block/:userId",
  validation(validators.userIdParamsSchema),
  userService.blockUser,
);
router.delete(
  "/unblock/:userId",
  validation(validators.userIdParamsSchema),
  userService.unBlockUser,
);

export default router;
