
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Play, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CodeEditorProps = {
  className?: string;
};

export function CodeEditor({ className }: CodeEditorProps) {
  const [code, setCode] = useState<string>("// Write your code here\nconsole.log('Hello from Gemini!');");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    
    setTimeout(() => {
      try {
        // Create a safe context for evaluation
        const originalConsoleLog = console.log;
        let outputCapture = "";
        
        // Override console.log to capture output
        console.log = (...args) => {
          outputCapture += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        };
        
        // Execute the code in try/catch
        try {
          // eslint-disable-next-line no-new-func
          new Function(code)();
          setOutput(outputCapture || "Code executed successfully (no output)");
        } catch (error) {
          if (error instanceof Error) {
            setOutput(`Error: ${error.message}`);
          } else {
            setOutput("An unknown error occurred");
          }
        }
        
        // Restore original console.log
        console.log = originalConsoleLog;
      } catch (error) {
        setOutput("Failed to execute code");
        toast.error("Error executing code");
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 p-4 grid grid-rows-2 gap-4 h-full">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Code Editor</h3>
            <Button
              size="sm"
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-1.5 h-8 text-xs"
            >
              {isRunning ? (
                <>
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Run Code
                </>
              )}
            </Button>
          </div>
          
          <Card className="flex-1 p-1 border bg-muted/40">
            <ScrollArea className="h-full w-full custom-scrollbar">
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-full border-0 bg-transparent focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed scrollbar-hide p-3"
              />
            </ScrollArea>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium">Output</h3>
          <Card className="flex-1 p-1 border bg-muted/40">
            <ScrollArea className="h-full w-full custom-scrollbar">
              <pre className="font-mono text-sm p-3 whitespace-pre-wrap">
                {output || "// Output will appear here after running the code"}
              </pre>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
