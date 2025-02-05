"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { NoteCard } from "@/components/NoteCard";
import { Note } from "@/interfaces/NotesInterface";
import axios, { AxiosResponse } from "axios";
import { ApiInterface } from "@/interfaces/ApiInterface";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useDebounceValue } from "usehooks-ts";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sortby, setSortby] = useState("NEWEST");
  const [debouncedSearchQuery, setDevouncedValue] = useDebounceValue("", 500);
  const [isFavorite, setIsFavorite] = useState<boolean>();

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiInterface<Note[]>> = await axios.get(
        `/api/notes?sortBy=${sortby}&search=${debouncedSearchQuery}&isFavourite=${
          isFavorite ?? ""
        }`
      );
      if (!response.data || !response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setNotes(response.data.data ?? []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error while doing signin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [debouncedSearchQuery, sortby, isFavorite]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isFavourite={isFavorite}
        setIsFavourite={setIsFavorite}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Header
          defaultValue={""}
          onSearchChange={setDevouncedValue}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          notes={notes}
          setNotes={setNotes}
          sortBy={sortby}
          setSortBy={setSortby}
        />

        <main className="flex-1 overflow-auto p-6 flex flex-col gap-3">
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center flex-col gap-2">
              <Spinner />
              <span className="text-2xl animate-pulse text-yellow-600 tracking-widest">
                loading...
              </span>
            </div>
          ) : !isLoading && notes?.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-2xl tracking-widest font-bold">
              <img
                src="https://img.freepik.com/free-vector/yellow-note-paper-with-red-pin_1284-42430.jpg?t=st=1738778078~exp=1738781678~hmac=cc2641662475f0b0359308ea4df04e8e77d89ffd80d0bf96d7bf64e66cec5cab&w=740"
                alt="empty image"
                className="h-[300px] w-[300px]"
              />
              <span> No Notes created yet!</span>
            </div>
          ) : (
            notes?.map((singleNote) => (
              <NoteCard
                key={JSON.stringify(singleNote.userId + singleNote._id)}
                note={singleNote}
                setNotes={setNotes}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
