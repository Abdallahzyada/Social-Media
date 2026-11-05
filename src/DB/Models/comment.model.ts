import { HydratedDocument, Model, model, Schema, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  parentId?: Types.ObjectId;
  content:String;
  createdBy:Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema<IComment>(
  {
    content:{type:String, minLength:2, maxLength:50000, required:true},
    postId:{type: Schema.Types.ObjectId, ref:"User", required:true},
    createdBy:{type: Schema.Types.ObjectId, ref:"User", required:true},
    parentId:{type:Schema.Types.ObjectId, ref:"Comment"}
  },
  { timestamps: true },
);

CommentSchema.index({ sendBy: 1, sendTo: 1 });

export const CommentModel: Model<IComment> = model<IComment>(
  "Comment",
  CommentSchema,
);
export type HommentDocuments = HydratedDocument<IComment>;
