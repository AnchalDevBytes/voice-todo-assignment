"use client";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Copy, Trash2, Star, Maximize2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  transcription?: string | null;
  isFavorite: boolean;
  createdAt: string;
  images: Array<{ id: string; url: string; }>;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: any) => void;
  onFavorite: (id: string, isFavorite: boolean) => void;
}

const NoteCard = ({ 
    note, 
    onDelete, 
    onEdit, 
    onFavorite 
}: NoteCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(note.content);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <>
      <Card
        className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {formatDate(note.createdAt)}
            </p>
            <h3 className="font-semibold">{note.title}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
        {note.images.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">{note.images.length} image{note.images.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn(
          "sm:max-w-[800px]",
          isFullscreen && "w-screen h-screen max-w-none inset-0 rounded-none"
        )}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle>{note.title}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => onFavorite(note.id, !note.isFavorite)}>
                <Star className={cn("h-4 w-4", note.isFavorite && "fill-yellow-400")} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <Tabs defaultValue="notes" className="mt-4">
            <TabsList>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4">
              <div className="prose prose-sm max-w-none">
                <p>{note.content}</p>
              </div>
              {note.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {note.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt=""
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="transcript" className="mt-4">
              {note.transcription ? (
                <p>{note.transcription}</p>
              ) : (
                <p className="text-muted-foreground">No transcription available</p>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NoteCard;
