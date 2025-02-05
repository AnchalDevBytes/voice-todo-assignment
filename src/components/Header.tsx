"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Note } from "@/interfaces/NotesInterface";
import { Search, SortDesc, Menu, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import CreateNoteDialog from "./CreateNoteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  defaultValue: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
}

export const Header = ({
  defaultValue,
  onSearchChange,
  onToggleSidebar,
  notes,
  setNotes,
  sortBy,
  setSortBy,
}: HeaderProps) => {
  return (
    <header className="border-b bg-background">
      <div className="px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-10 w-full"
            defaultValue={defaultValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-0 lg:gap-10">
          <CreateNoteDialog notes={notes} setNotes={setNotes} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <SortDesc className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="OLDEST">
                  Oldest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="NEWEST">
                  Newest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
