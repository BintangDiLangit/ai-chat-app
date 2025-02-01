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
    <div className="w-80 border-r border-border flex flex-col bg-card">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Chat - MBC</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={onNewChat}
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-10 bg-muted/50" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {["AI Image Generation", "Code Review", "Data Analysis"].map(
            (chat, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start rounded-lg hover:bg-muted/50"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {chat}
              </Button>
            )
          )}
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start">
          <Avatar className="h-6 w-6 mr-2">
            <User className="h-4 w-4" />
          </Avatar>
          My Profile
        </Button>
      </div>
    </div>
  );
}
