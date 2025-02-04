import { Schema, model, Document, Types, models } from "mongoose";
import { IUser, IImage } from "@/interfaces/models.interface";

export interface INote extends Document {
  title: string;
  content: string;
  transcription?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId | IUser;
  images: IImage[];
}

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  transcription: { type: String },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

noteSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "noteId",
});

export const Note = models.Note || model<INote>("Note", noteSchema);
