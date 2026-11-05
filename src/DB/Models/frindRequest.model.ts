import { HydratedDocument, Model, model, Schema, Types } from "mongoose";

export interface IFrindRequest {
  _id: Types.ObjectId;
  sendBy: Types.ObjectId;
  sendTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const frindRequestSchema = new Schema<IFrindRequest>(
  {
    sendBy:{type: Schema.Types.ObjectId, ref:"User", required:true},
    sendTo:{type: Schema.Types.ObjectId, ref:"User", required:true},
  },
  { timestamps: true },
);

frindRequestSchema.index({ sendBy: 1, sendTo: 1 });

export const FrindRequestModel: Model<IFrindRequest> = model<IFrindRequest>(
  "freindRequest",
  frindRequestSchema,
);
export type HFriendRequestDocuments = HydratedDocument<IFrindRequest>;
