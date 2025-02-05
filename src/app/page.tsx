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

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiInterface<Note[]>> = await axios.get(
        "/api/notes"
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          notes={notes}
          setNotes={setNotes}
        />

        <main className="flex-1 overflow-auto p-6 flex flex-col gap-3">
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center flex-col gap-2">
              <Spinner />
              <span className="text-2xl animate-pulse text-yellow-600 tracking-widest">
                loading...
              </span>
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
