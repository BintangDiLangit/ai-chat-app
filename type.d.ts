type MessageRole = "user" | "assistant";
type FileData = { name: string; url: string; type: string };

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  files?: File[];
  timestamp: string;
}
