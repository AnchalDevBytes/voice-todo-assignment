"use client";
import { CircleX, Edit, Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Note, NoteFormData } from "@/interfaces/NotesInterface";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import axios, { AxiosResponse } from "axios";
import { ApiInterface } from "@/interfaces/ApiInterface";
import { toast } from "react-toastify";
import { Input } from "./ui/input";
import { uploadImageApiCall } from "@/helpers/uploadImage";
import Spinner from "./Spinner";

const EditNoteDialog = ({
  note,
  setNotes,
}: {
  note: Note;
  setNotes: Dispatch<SetStateAction<Note[]>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempNote, setTempNote] = useState<NoteFormData>({
    title: note.title,
    content: note.content,
    images: note.images,
  });
  const [areImagesUploading, setAreImagesUploading] = useState(false);
  const [isCreatingNote, setIsUpdating] = useState(false);
  const notesRef = useRef(note);

  const updateNoteById = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const response: AxiosResponse<ApiInterface<Note>> = await axios.put(
        `/api/notes/${note._id}`,
        tempNote
      );
      if (!response || !response.data.data || !response.data.success) {
        toast.error(response.data.message ?? "Could not update note!");
        return;
      }
      if (response.data.data !== notesRef.current) {
        setNotes((prev) => {
          if (!response.data.data) return prev;
          const noteExists = prev.some(
            (note) => note._id === response.data.data?._id
          );

          if (noteExists) {
            return prev.map((note) =>
              note._id === response.data.data?._id ? response.data.data : note
            );
          } else {
            return [response.data.data, ...prev];
          }
        });
      }

      setIsOpen(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error while updateing note");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const imageChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    if (files?.length > 3) {
      toast.error("You can upload only 3 images");
      return;
    }
    if (files && files.length > 0) {
      try {
        setAreImagesUploading(true);
        const uploadPromises = Array.from(files).map((file) =>
          uploadImageApiCall(file)
        );

        const imageUrls = (await Promise.all(uploadPromises)) as string[];

        if (!imageUrls || !imageUrls.length) {
          toast.error("Error while uploading images");
          return;
        }

        setTempNote((prev) => {
          return {
            ...prev,
            images: [...(prev.images ?? []), ...imageUrls],
          };
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Error while uploading images");
        }
      } finally {
        setAreImagesUploading(false);
      }
    }
  };

  const handleRemoveImage = (image: string) => {
    setTempNote((prev) => {
      return {
        ...prev,
        images: prev.images?.filter((img) => img !== image) ?? [],
      };
    });
  };

  useEffect(() => {
    if (!open) {
      setTempNote({
        title: note.title,
        content: note.content,
        images: note.images,
      });
    }
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-gray-200 transition-all duration-200 text-black px-4 py-2 rounded-lg">
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2">
          <Pencil className="h-[18px] w-[18px]" /> <span>Note</span>
        </DialogTitle>
        <form
          onSubmit={updateNoteById}
          className="w-full flex flex-col items-end"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Enter the Title"
              className="w-full"
              value={tempNote.title}
              onChange={(e) =>
                setTempNote({ ...tempNote, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content of your note..."
              className="w-full border-[0.5px] border-gray-800 rounded-md p-2 focus-within:outline-none resize-y"
              rows={5}
              value={tempNote.content}
              onChange={(e) =>
                setTempNote({ ...tempNote, content: e.target.value })
              }
            />

            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-3 max-w-full">
                {tempNote?.images?.map((image, index) => {
                  return (
                    <div
                      key={index + JSON.stringify(image)}
                      className="relative"
                    >
                      <button
                        onClick={() => handleRemoveImage(image)}
                        className="absolute -top-2 -right-2 text-white rounded-full bg-black"
                      >
                        <CircleX />
                      </button>
                      <img
                        className="h-20 w-20 rounded-lg border border-slate-700"
                        src={image}
                        alt={image + index}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 border border-black rounded-lg">
                <Input
                  type="file"
                  className="w-full shadow-none border-none outline-none"
                  multiple
                  onChange={imageChangeHandler}
                />
                {areImagesUploading && (
                  <Spinner className="h-5 aspect-square  mr-3" />
                )}
              </div>
            </div>
          </div>
          <Button
            disabled={
              isCreatingNote ||
              areImagesUploading ||
              !tempNote.title ||
              !tempNote.content
            }
            type="submit"
            variant={"default"}
            className="mt-3"
          >
            {isCreatingNote ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
