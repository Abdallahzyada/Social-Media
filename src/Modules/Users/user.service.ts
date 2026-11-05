import { Request, Response } from "express";
import { IRequestIdParamsDTO, IUserIdParamsDTO } from "./user.dts";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { userModel } from "../../DB/Models/user.model";
import { FrindRequestModel } from "../../DB/Models/frindRequest.model";

class UserService {
  constructor() {}
  sendFrindRequest = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as { userId: string };
    const senderId = req.user!._id;

    if (userId === senderId?.toString())
      throw new BadRequestException("You cannot add yourself");

    const target = await userModel.findById(userId);
    if (!target) throw new NotFoundException("User Not Found");

    if (
      target.blockedUsers?.some((id) => id.equals(senderId)) ||
      req.user?.blockedUsers?.some((id) => id.equals(target.id))
    )
      throw new ForbiddenException("Cannot send request to this user");

    if (target.friends?.some((id) => id.equals(senderId)))
      throw new ConflictException("You are alread frineds");

    const existing = await FrindRequestModel.findOne({
      $or: [
        { sendBy: senderId, sendTo: userId },
        { sendBy: userId, sendTo: senderId },
      ],
    });
    if (existing) throw new ConflictException("friend request alread exists");

    const freindRequest = await FrindRequestModel.create({
      sendBy: senderId,
      sendTo: userId,
    });

    return res
      .status(201)
      .json({ message: "Friend request send", data: { freindRequest } });
  };

  listFriendRequs = async (req: Request, res: Response): Promise<Response> => {
    const friendRequst = await FrindRequestModel.find({ sendTo: req.user!._id })
      .populate("sendBy", "firstName lastName email -_id")
      .lean();
    return res
      .status(201)
      .json({ message: "Friend request send", data: { friendRequst } });
  };

  acceptFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };

    const friendRequst = await FrindRequestModel.findOne({
      _id: requestId,
      sendTo: req.user!._id,
    });

    if (!friendRequst)
      throw new NotFoundException("Friend Request Not found Send one");

    await Promise.all([
      userModel.updateOne(
        { _id: friendRequst.sendBy },
        { $addToSet: { friends: friendRequst.sendTo } },
      ),
      userModel.updateOne(
        { _id: friendRequst.sendTo },
        { $addToSet: { friends: friendRequst.sendBy } },
      ),
    ]);

    await FrindRequestModel.deleteOne({ _id: requestId });
    return res.status(201).json({ message: "Friend request accepted" });
  };

  rejectFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };

    // findOneAndDelete takes a filter; findByIdAndDelete only takes an id
    const friendRequst = await FrindRequestModel.findOneAndDelete({
      _id: requestId,
      $or: [{ sendTo: req.user!._id }, { sendBy: req.user!._id }],
    });

    if (!friendRequst)
      throw new NotFoundException("Friend Request Not found Send  one");

    return res.status(201).json({ message: "Friend request removed" });
  };

  removeFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    if (userId === myId.toString())
      throw new BadRequestException("You cannot remove yourself");

    // Only matches if userId is actually in my friends list
    const result = await userModel.updateOne(
      { _id: myId, friends: userId },
      { $pull: { friends: userId } },
    );
    if (!result.modifiedCount)
      throw new NotFoundException("This user is not in your friends list");

    await userModel.updateOne({ _id: userId }, { $pull: { friends: myId } });
    return res.status(201).json({ message: "Friend removed Successfully" });
  };

  blockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;
    if (userId === myId.toString())
      throw new BadRequestException("You cannot block yourself");

    const target = await userModel.findById(userId);

    if (!target) throw new NotFoundException("User Not found");

    await Promise.all([
      userModel.updateOne(
        { _id: myId },
        { $addToSet: { blockedUsers: userId }, $pull: { friends: userId } },
      ),
      userModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
      FrindRequestModel.deleteMany({
        $or: [
          { sendBy: myId, sendTo: userId },
          { sendBy: userId, sendTo: myId },
        ],
      }),
    ]);
    return res.status(201).json({ message: "User Blocked Successfully" });
  };

  unBlockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };

    const updated = await userModel.updateOne(
      { _id: req.user!._id, blockedUsers: userId },
      { $pull: { blockedUsers: userId } },
    );

    if (!updated.modifiedCount)
      throw new NotFoundException("This user is not in your blocked list");
    return res.status(201).json({ message: "User UnBlocked Successfully" });
  };
}
export default new UserService();
