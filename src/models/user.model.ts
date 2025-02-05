import { Schema, model, Document, models } from "mongoose";
import { INote } from "@/interfaces/models.interface";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  notes: INote[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
});

export const User = models.User || model<IUser>("User", userSchema);
