"use client";

import { useRef } from "react";
import { Send, Mic, Paperclip, Image, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ChatInputProps {
  message: string;
  files: File[];
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

export function ChatInput({
  message,
  files,
  onMessageChange,
  onSend,
  onFileSelect,
  onFileRemove,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-6 bg-background">
      <Card className="max-w-4xl mx-auto">
        {files.length > 0 && (
          <div className="p-3 border-b flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted rounded-lg p-2"
              >
                {file.type.startsWith("image/") ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span className="text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => onFileRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="p-3 flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            className="flex-1"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            className="hidden"
            multiple
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={onSend}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
