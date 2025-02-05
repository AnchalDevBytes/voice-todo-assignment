"use client";
import { Circle, CircleX, DoorClosed, Home, Star } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-md transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-2 text-gray-500 bg-gray-300 p-1 rounded-full lg:hidden"
          aria-label="Close Sidebar"
        >
          <CircleX className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <h1 className="text-xl font-semibold">AI Notes</h1>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-10">
        <nav className="flex gap-5 flex-col">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/favorites">
            <Button
              variant={pathname === "/favorites" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Star className="h-4 w-4" />
              Favorites
            </Button>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
