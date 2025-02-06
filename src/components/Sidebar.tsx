"use client";
import { CircleX, DoorClosed, Home, Star } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ApiInterface } from "@/interfaces/ApiInterface";
import { Dispatch, SetStateAction, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setIsFavourite: Dispatch<SetStateAction<boolean | undefined>>;
  isFavourite: boolean | undefined;
}

const Sidebar = ({
  isOpen,
  onClose,
  setIsFavourite,
  isFavourite,
}: SidebarProps) => {
  const [isLogingOut, setIsLogingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLogingOut(true);
      const response: AxiosResponse<ApiInterface<any>> = await axios.post(
        "/api/signout"
      );
      if (!response || !response.data.success) {
        toast.error("Error loging out user!");
        return;
      }
      toast.success("User logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error loging out user!");
      }
    } finally {
      setIsLogingOut(false);
    }
  };

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
            <span className="text-white font-semibold">N</span>
          </div>
          <h1 className="text-xl font-semibold">Notes</h1>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-10">
        <nav className="flex gap-5 flex-col">
          <Button
            onClick={() => setIsFavourite(undefined)}
            variant={!isFavourite ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            onClick={() => setIsFavourite(true)}
            variant={isFavourite ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Star className="h-4 w-4" />
            Favorites
          </Button>
          <hr />
          <Button
            onClick={handleLogout}
            variant={"destructive"}
            className="mt-2"
            disabled={isLogingOut}
          >
            {isLogingOut ? (
              "Logging out..."
            ) : (
              <span className="flex items-center gap-1">
                <span>Logout</span> <DoorClosed className="h-4 w-4" />
              </span>
            )}
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
