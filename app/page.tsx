"use client";

import { ChatSection } from "@/components/Chat/ChatSection";
import { Sidebar } from "@/components/Chat/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_MESSAGE: ChatMessageProps = {
  role: "assistant",
  content: "👋 Hello! I'm your AI assistant. How can I help you today?",
  timestamp: new Date().toISOString(),
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<ChatMessageProps>>([]);

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
  }, [chatHistory]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    const userMessage: ChatMessageProps = {
      role: "user",
      content: message,
      files: files.map(
        (file) =>
          new File([file], file.name, {
            type: file.type,
          })
      ),
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

      const aiMessage: ChatMessageProps = {
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
      const errorMessage: ChatMessageProps = {
        role: "assistant",
        content: "⚠️ Error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      console.log(error);
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
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar onNewChat={handleNewChat} />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
