"use client";

import { Avatar } from "@/components/ui/avatar";
import { User, Sparkles, Image, FileText } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  files?: File[];
}

const cleanHTML = (text: string) => {
  return text.replace(/<\/?think>/g, "");
};

export function ChatMessage({
  role,
  content,
  timestamp,
  files,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } items-start gap-3`}
    >
      {role === "assistant" && (
        <Avatar className="h-8 w-8">
          <Sparkles className="h-4 w-4" />
        </Avatar>
      )}
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
        }`}
      >
        <div
          className="prose prose-sm dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: cleanHTML(content) }}
        />
        {files && files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file: File, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-background/10 rounded-lg p-2"
              >
                {file.type.startsWith("image/") ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-1 text-xs opacity-50">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
      {role === "user" && (
        <Avatar className="h-8 w-8">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
}
