"use client";

import { MessageCircle, Plus, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <div className="h-full w-full border-r border-border flex flex-col bg-card">
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold">AI Chat</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div className="px-3 sm:px-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base"
          onClick={onNewChat}
        >
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> New Chat
        </Button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8 sm:pl-10 bg-muted/50 text-sm sm:text-base"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {["AI Image Generation", "Code Review", "Data Analysis"].map(
            (chat, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start rounded-lg hover:bg-muted/50 text-sm sm:text-base"
              >
                <MessageCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {chat}
              </Button>
            )
          )}
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-3 sm:p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm sm:text-base"
        >
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mr-2">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
          </Avatar>
          My Profile
        </Button>
      </div>
    </div>
  );
}
