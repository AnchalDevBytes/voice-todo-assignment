"use client";

import { Button } from "@/components/ui/button";
import { Mic, ImageIcon } from "lucide-react";

interface ActionButtonsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onImageUpload: () => void;
}

export const ActionButtons = ({
  isRecording,
  onToggleRecording,
  onImageUpload,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-4 bg-slate-200 border-2 mb-7 w-full px-8 py-2 rounded-full lg:w-[50%] mx-auto">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={onImageUpload}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={onToggleRecording}
      >
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
};
