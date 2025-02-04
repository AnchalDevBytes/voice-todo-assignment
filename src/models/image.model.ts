import { Schema, model, Document, Types, models } from "mongoose";
import { INote } from "@/interfaces/models.interface";

export interface IImage extends Document {
  url: string;
  noteId: Types.ObjectId | INote;
  createdAt: Date;
}

const imageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Image = models.Image || model<IImage>("Image", imageSchema);
