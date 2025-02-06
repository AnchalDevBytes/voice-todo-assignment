"use client";
import { CircleX, Mic, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { uploadImageApiCall } from "@/helpers/uploadImage";
import Spinner from "@/components/Spinner";

const CreateNoteDialog = ({
  notes,
  setNotes,
}: {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempNote, setTempNote] = useState<NoteFormData>({
    title: "",
    content: "",
    images: [],
  });
  const [areImagesUploading, setAreImagesUploading] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const notesRef = useRef(notes);
  const [isRecording, setIsRecording] = useState(false);
  const [currentInput, setCurrentInput] = useState<"title" | "content" | null>(
    null
  );
  const currentInputRef = useRef<"title" | "content" | null>(null);

  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  const createNotes = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingNote(true);
      const response: AxiosResponse<ApiInterface<Note>> = await axios.post(
        "/api/notes",
        tempNote
      );
      if (!response || !response.data.data || !response.data.success) {
        toast.error(response.data.message ?? "Could not create note!");
        return;
      }
      if (!notesRef.current.includes(response.data.data)) {
        setNotes((prev) => {
          if (!response.data.data) return prev;
          return [response.data.data, ...prev];
        });
      }

      setIsOpen(false);
      setTempNote({
        title: "",
        content: "",
        images: [],
      });
      toast.success("Note created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error while doing signin");
      }
    } finally {
      setIsCreatingNote(false);
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
    if (!isOpen) {
      setTempNote({
        title: "",
        content: "",
        images: [],
      });
    }
  }, [isOpen]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        // console.log("event", event);
        const transcript =
          event.results[event.results.length - 1][0].transcript;

        const current = currentInputRef.current;

        if (current === "title") {
          setTempNote((prev) => ({ ...prev, title: transcript }));
        } else if (current === "content") {
          setTempNote((prev) => ({ ...prev, content: transcript }));
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setCurrentInput(null);
      };
      recognitionRef.current = recognition;
    } else {
      toast.error("Speech recognition not supported!");
    }
  }, []);

  const handleMicClick = (inputType: "title" | "content") => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setCurrentInput(null);
    } else {
      setCurrentInput(inputType);
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-slate-800 bg-slate-950 transition-all duration-200 text-white px-4 py-2 rounded-lg">
        <Plus className="h-4 w-4" />
        <span className="hidden lg:flex">Create Note</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2">
          <Pencil className="h-[18px] w-[18px]" /> <span>Note</span>
        </DialogTitle>
        <form onSubmit={createNotes} className="w-full flex flex-col items-end">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="relative flex gap-2 w-full">
              <Input
                type="text"
                placeholder="Enter the Title"
                className="w-full"
                value={tempNote.title}
                onChange={(e) =>
                  setTempNote({ ...tempNote, title: e.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMicClick("title");
                }}
                className={`absolute right-2 ${
                  isRecording && currentInput === "title"
                    ? "text-red-400"
                    : "text-gray-500"
                }`}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative flex gap-2 w-full">
              <textarea
                placeholder="Content of your note..."
                className="w-full border-[0.5px] border-gray-800 rounded-md p-2 focus-within:outline-none resize-y"
                rows={5}
                value={tempNote.content}
                onChange={(e) =>
                  setTempNote({ ...tempNote, content: e.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMicClick("content");
                }}
                className={`absolute right-2 ${
                  isRecording && currentInput === "content"
                    ? "text-red-400"
                    : "text-gray-500"
                }`}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>

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

export default CreateNoteDialog;
