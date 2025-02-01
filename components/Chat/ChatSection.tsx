"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  files?: File[];
}

interface ChatSectionProps {
  chatHistory: Message[];
  message: string;
  files: File[];
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

export function ChatSection({
  chatHistory,
  message,
  files,
  isLoading,
  onMessageChange,
  onSend,
  onFileSelect,
  onFileRemove,
}: ChatSectionProps) {
  return (
    <div className="flex-1 flex flex-col bg-background/95">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              role={chat.role}
              content={chat.content}
              timestamp={chat.timestamp}
              files={chat.files}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <p className="ml-2 text-sm text-gray-400">
                Lagi Mikir bro, Sabar...
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput
        message={message}
        files={files}
        onMessageChange={onMessageChange}
        onSend={onSend}
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
      />
    </div>
  );
}
