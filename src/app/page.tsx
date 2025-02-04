"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, ImageIcon, Search, SortDesc, Menu } from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import Sidebar from '@/components/Sidebar';

// Mock data for development
const mockNotes = [
  {
    id: '1',
    title: 'Engineering Assignment Audio',
    content: "I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.",
    transcription: null,
    isFavorite: true,
    createdAt: '2025-01-30T17:26:00.000Z',
    images: [{ id: '1', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' }]
  },
  {
    id: '2',
    title: 'Random Sequence',
    content: 'ssxscscscssc',
    transcription: null,
    isFavorite: false,
    createdAt: '2025-01-30T17:21:00.000Z',
    images: []
  }
];

const Home = () => {
  const [notes, setNotes] = useState(mockNotes);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEdit = (id: string, updates: any) => {
    setNotes(notes.map(note => note.id === id ? { ...note, ...updates } : note));
  };

  const handleFavorite = (id: string, isFavorite: boolean) => {
    setNotes(notes.map(note => note.id === id ? { ...note, isFavorite } : note));
  };

  return (
  <div className="flex h-screen bg-background">
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <div className="flex-1 flex flex-col">
      <header className="border-b bg-background">
        <div className="px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      </main>

      <div className="fixed bottom-8 mx-10 flex gap-4 bg-gray-400 w-full border-4 border-red-400">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={() => setIsRecording(!isRecording)}
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    </div>
    </div>
  );
}

export default Home;
