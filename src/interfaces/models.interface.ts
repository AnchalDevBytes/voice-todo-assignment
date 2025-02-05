import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  notes: INote[];
}

export interface INote {
  title: string;
  content: string;
  transcription?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId | IUser;
  images: string[];
}
