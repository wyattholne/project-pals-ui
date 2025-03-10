
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Loader, Zap, User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "gemini";
  timestamp: Date;
};

type ChatInterfaceProps = {
  className?: string;
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate Gemini typing
    setIsTyping(true);
    
    // Simulate API delay (2-4 seconds)
    const delay = Math.floor(Math.random() * 2000) + 2000;
    setTimeout(() => {
      const geminiResponses = [
        "I've analyzed the code you provided. The issue appears to be in the state management logic. Try using a reducer pattern instead of multiple state variables.",
        "Based on the files you've uploaded, I recommend restructuring your component hierarchy to improve performance. The current nested structure may cause unnecessary re-renders.",
        "The UI design looks good, but there are opportunities to improve accessibility. Consider adding ARIA attributes and ensuring proper keyboard navigation.",
        "I've examined your project structure. To better organize your codebase, I suggest implementing a feature-based folder structure rather than separating by file types.",
        "Your implementation looks solid. To enhance it further, consider adding error boundaries and implementing proper loading states.",
      ];
      
      const randomResponse = geminiResponses[Math.floor(Math.random() * geminiResponses.length)];
      
      const geminiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "gemini",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, geminiMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <Zap className="h-12 w-12 mb-4 text-gemini-500" />
              <h2 className="text-xl font-semibold mb-2">Gemini AI Assistant</h2>
              <p className="text-muted-foreground max-w-md">
                Ask anything about your project, or upload files for me to analyze. I can help with coding, debugging, and more.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "animate-fade-in flex max-w-[85%]",
                  message.sender === "user" ? "ml-auto" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "flex gap-3 rounded-lg p-4",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.sender === "user" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gemini-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex max-w-[85%] mr-auto">
              <div className="flex gap-3 rounded-lg p-4 bg-muted">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gemini-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini..."
              className="min-h-[60px] pr-12 resize-none"
              maxLength={4000}
            />
            <Button
              size="icon"
              disabled={isTyping || !inputValue.trim()}
              onClick={handleSendMessage}
              className="absolute right-2 bottom-2 h-8 w-8"
            >
              {isTyping ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
