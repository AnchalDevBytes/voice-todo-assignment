export interface Note {
  _id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  images?: string[];
}

export interface NoteFormData {
  title: string;
  content: string;
  images?: string[];
}
