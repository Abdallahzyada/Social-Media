import { Request, Response } from "express-serve-static-core";
import {
  ICommentIdParamsDTO,
  ICreateCommentDTO,
  ICreatePostDTO,
  IPostIdParamsDTO,
  IUpdateCommentDTO,
} from "./post.dto";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { PostModel } from "../../DB/Models/post.model";
import { CommentModel } from "../../DB/Models/comment.model";

class PostService {
  constructor() {}
  createPost = async (req: Request, res: Response): Promise<Response> => {
    const { content }: ICreatePostDTO = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!content && !files?.length)
      throw new BadRequestException(`Post must have content or attachments`);

    const post = await PostModel.create({
      ...(content && { content }),
      createdBy: req.user!._id,
      ...(files?.length && { attachments: files.map((file) => file.path) }),
    });

    return res.status(200).json({ message: "post created", data: { post } });
  };

  toggleLikePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };
    const userId = req.user!._id;

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });

    if (!post) throw new NotFoundException("Post Not Found");

    const alreadyLiked = post.likes?.some((id) => id.equals(userId));
    const updated = await PostModel.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true },
    );
    return res.status(200).json({
      message: alreadyLiked ? "Post Unliked" : "Post Liked",
      data: { updated },
    });
  };
  getSpecificPost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    })
      .populate("createdBy", "firstName lastName email -_id")
      .lean();

    if (!post) throw new NotFoundException("Post Not Found");

    return res.status(200).json({
      message: "Done",
      data: { post },
    });
  };

  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };
    const { content } = req.body;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId, createdBy: req.user!._id },
      { content, $inc: { __v: 1 } },
      { new: true },
    );
    if (!post) throw new NotFoundException("Post Not Found");
    return res.status(200).json({
      message: "post updated successfully",
      data: { post },
    });
  };

  deletePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };

    const post = await PostModel.findOneAndDelete({
      _id: postId,
      createdBy: req.user!._id,
    });

    if (!post)
      throw new ForbiddenException("Post Not Found or You are not the Author");
    return res.status(200).json({
      message: "post Deleted successfully",
    });
  };

  createComments = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };
    const { content, parentId }: ICreateCommentDTO = req.body;

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });
    if (!post) throw new NotFoundException("Post not found");
    if (parentId) {
      const parent = await CommentModel.findOne({ _id: parentId, postId });
      if (!parent) throw new NotFoundException("Parent Comment Not Exists");
    }

    const comment = await CommentModel.create({
      postId,
      ...(parentId && { parentId }),
      content,
      createdBy: req.user!._id,
    });

    return res.status(200).json({
      message: "Comment Created successfully",
      data: { comment },
    });
  };
  updateComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId }: ICommentIdParamsDTO = req.params as {
      commentId: string;
    };
    const { content }: IUpdateCommentDTO = req.body;

    const comment = await CommentModel.findOneAndUpdate(
      {
        _id: commentId,
        createdBy: req.user!._id,
      },
      { content },
      { new: true },
    );
    if (!comment)
      throw new ForbiddenException(
        "Comment Not Found or you are not the author",
      );

    return res.status(200).json({
      message: "Comment Updated successfully",
      data: { comment },
    });
  };

  deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId }: ICommentIdParamsDTO = req.params as {
      commentId: string;
    };

    const comment = await CommentModel.findById(commentId);

    if (!comment) throw new NotFoundException("Comment not found");

    const post = await PostModel.findById(comment.postId);

    const isCommentAuthor = comment?.createdBy.equals(req.user!._id);
    const isPostOwner = post?.createdBy.equals(req.user!._id);

    if (!isCommentAuthor && !isPostOwner)
      throw new ForbiddenException("Not authorized to delete this comment");

      await Promise.all([
        CommentModel.deleteOne({_id:commentId}),
        CommentModel.deleteMany({parentId:commentId})
      ])

    return res.status(200).json({
      message: "Comment Deleted successfully",
    });
  };
}

export default new PostService();
