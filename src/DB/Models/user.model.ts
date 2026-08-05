import { HydratedDocument, model, Model, Schema, Types } from "mongoose";
import { GenderEnum, RoleEnum } from "../../Utils/enums/user.enum";
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username?: string;

  email: string;
  confirmEmailOTP?: string;
  confirmedAt?: Date;

  password: string;
  resetPasswordOTP?: string;

  phone?: string;
  address?: string;

  gender: GenderEnum;
  role: RoleEnum;

  createdAt: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, minLength: 2, maxLength: 25, required: true },
    lastName: { type: String, minLength: 2, maxLength: 25, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    confirmEmailOTP: String,
    confirmedAt: Date,
    password: { type: String, required: true },
    resetPasswordOTP: String,
    phone: String,
    address: String,
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.confirmEmailOTP;
        delete ret.resetPasswordOTP;
        return ret;
      },
    },
  },
);

userSchema
  .virtual("username")
  .set(function (value: string) {
    const [firstName, ...rest] = value.trim().split(/\s+/);
    this.set({ firstName, lastName: rest.join(" ") });
  })
  .get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
  });

export const userModel: Model<IUser> = model<IUser>("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>