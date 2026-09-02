import { Request, Response } from "express-serve-static-core";
import { ICreatePostDTO } from "./post.dto";
import { BadRequestException } from "../../Utils/response/error.response";
import { PostModel } from "../../DB/Models/post.model";

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
      ...(files?.length && {attachments: files.map((file) => file.path)})
    } as any);

    return res.status(200).json({ message: "post created", data: { post } });
  };
}

export default new PostService();
