import { Schema, model, Document, Types, models } from "mongoose";
import { IUser } from "@/interfaces/models.interface";

export interface INote extends Document {
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId | IUser;
  images: string[];
}

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }],
});

export const Note = models.Note || model<INote>("Note", noteSchema);
