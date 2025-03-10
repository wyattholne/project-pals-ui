
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatInterface } from "../chat/ChatInterface";
import { CodeEditor } from "../code/CodeEditor";
import { MediaRecorder } from "../media/MediaRecorder";
import { MessageSquare, Code, Camera } from "lucide-react";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Code</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1">
        <TabsContent value="chat" className="h-full m-0 border-none">
          <ChatInterface />
        </TabsContent>
        <TabsContent value="code" className="h-full m-0 border-none">
          <CodeEditor />
        </TabsContent>
        <TabsContent value="media" className="h-full m-0 border-none">
          <MediaRecorder />
        </TabsContent>
      </div>
    </div>
  );
}
