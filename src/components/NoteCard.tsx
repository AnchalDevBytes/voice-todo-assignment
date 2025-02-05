"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Star } from "lucide-react";
import { Note } from "@/interfaces/NotesInterface";
import { formatDate } from "@/utils/formatDate";
import { Dispatch, SetStateAction, useState } from "react";
import EditNoteDialog from "./EditNoteDialog";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import { ApiInterface } from "@/interfaces/ApiInterface";
import Spinner from "./Spinner";

interface NoteCardProps {
  note: Note;
  setNotes: Dispatch<SetStateAction<Note[]>>;
}

export function NoteCard({ note, setNotes }: NoteCardProps) {
  const [isFavoriting, setisFavouriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(isFavorite, "------", !note.isFavorite);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/notes/${note._id}`);
      if (!response || !response.data.success) {
        toast.error(response.data.message);
        return;
      }
      toast.success("Note deleted successfully!");
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error while deleting note");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  const handleFavourite = async () => {
    try {
      setisFavouriting(true);
      const response: AxiosResponse<ApiInterface<Note>> = await axios.put(
        `/api/notes/${note._id}`,
        {
          isFavourite: !note.isFavorite,
        }
      );
      if (!response || !response.data.data || !response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setIsFavorite(!note.isFavorite);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Error while favouriting note");
    } finally {
      setisFavouriting(false);
    }
  };

  return (
    <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {formatDate(note.createdAt)}
          </p>
          <h3 className="font-semibold">{note.title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={isFavoriting}
            variant="ghost"
            size="icon"
            onClick={handleFavourite}
          >
            {isFavoriting ? (
              <Spinner className="w-4 aspect-square" />
            ) : (
              <Star className={`h-4 w-4 ${isFavorite && "text-yellow-500"}`} />
            )}
          </Button>
          <EditNoteDialog note={note} setNotes={setNotes} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner className="w-4 aspect-square border-t-red-700" />
            ) : (
              <Trash2 className={`h-4 w-4`} />
            )}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3">
        {note.content}
      </p>
      {note.images && note?.images?.length > 0 && (
        <div className="mt-4">
          <span className="text-sm text-muted-foreground">
            {note?.images?.length} image{note?.images?.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </Card>
  );
}
