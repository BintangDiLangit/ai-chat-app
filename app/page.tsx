"use client";

import { ChatSection } from "@/components/Chat/ChatSection";
import { Sidebar } from "@/components/Chat/Sidebar";
import { useEffect, useState } from "react";

type MessageRole = "user" | "assistant";
type FileData = { name: string; url: string; type: string };

interface ChatMessage {
  role: MessageRole;
  content: string;
  files?: FileData[];
  timestamp: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "👋 Hello! I'm your AI assistant. How can I help you today?",
  timestamp: new Date().toISOString(),
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<any>>([]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: "assistant" as const,
          content: "👋 Hello! I'm your AI assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      files: files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      })),
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setFiles([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let receivedText = "";

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);

        try {
          // Parse each chunk safely
          console.log("test");
          console.log(chunk);

          const json = JSON.parse(chunk);
          if (json.response) {
            receivedText += json.response;
          }
        } catch (error) {
          console.error("Error parsing response chunk:", error);
        }

        // Update the last AI message progressively
        setChatHistory((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, content: receivedText } : msg
          )
        );
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "⚠️ Error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleNewChat = () => {
    setChatHistory([INITIAL_MESSAGE]);
    setMessage("");
    setFiles([]);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNewChat={handleNewChat} />
      <ChatSection
        chatHistory={chatHistory}
        message={message}
        files={files}
        isLoading={isLoading}
        onMessageChange={setMessage}
        onSend={handleSend}
        onFileSelect={handleFileSelect}
        onFileRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
      />
    </div>
  );
}
