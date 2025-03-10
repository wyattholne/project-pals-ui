
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Camera, ExternalLink, File, FileImage, FileText, FolderPlus, HardDrive, Mic, Moon, Settings, Sun, Trash, Upload, UploadCloud } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [files, setFiles] = useState<{ name: string; type: string }[]>([]);
  const [driveConnected, setDriveConnected] = useState(false);
  const [projectName, setProjectName] = useState("My Gemini Project");
  const [projectNotes, setProjectNotes] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    
    const newFiles = Array.from(uploadedFiles).map(file => {
      const type = getFileType(file.name);
      return { name: file.name, type };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    
    const newFiles = Array.from(droppedFiles).map(file => {
      const type = getFileType(file.name);
      return { name: file.name, type };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${droppedFiles.length} file(s) uploaded successfully`);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("File removed successfully");
  };
  
  const connectToDrive = () => {
    setDriveConnected(true);
    toast.success("Connected to Google Drive successfully");
  };
  
  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return 'image';
    } else if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp'].includes(ext)) {
      return 'code';
    } else {
      return 'text';
    }
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4" />;
      case 'code':
        return <File className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-80 flex-col bg-sidebar border-r border-border transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <input 
            type="text" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
            className="font-semibold text-lg bg-transparent border-none focus:outline-none max-w-56"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === "dark" ? "Light mode" : "Dark mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Project Files</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag & Drop Files Here</p>
                  <div className="flex justify-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-xs font-medium px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        Browse Files
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {getFileIcon(file.type)}
                          <span className="text-sm truncate max-w-40">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {files.length > 0 && (
                  <div className="mt-2">
                    <Separator className="my-4" />
                    <h4 className="text-sm font-medium mb-2">File Summary</h4>
                    <div className="text-xs text-muted-foreground">
                      <p>{files.length} file(s) uploaded</p>
                      <p>{files.filter(f => f.type === 'image').length} image(s)</p>
                      <p>{files.filter(f => f.type === 'code').length} code file(s)</p>
                      <p>{files.filter(f => f.type === 'text').length} text file(s)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Project Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Textarea
                  placeholder="Add your project notes here..."
                  className="min-h-24 text-sm"
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">External Services</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      <span className="text-sm">Google Drive</span>
                    </div>
                    <Button
                      size="sm"
                      variant={driveConnected ? "outline" : "default"}
                      className="h-8 text-xs"
                      onClick={connectToDrive}
                      disabled={driveConnected}
                    >
                      {driveConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                  
                  {driveConnected && (
                    <div className="mt-2 space-y-2">
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
                        <UploadCloud className="h-3.5 w-3.5 mr-2" />
                        Upload to Drive
                      </Button>
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
                        <FolderPlus className="h-3.5 w-3.5 mr-2" />
                        Browse Drive Files
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">Media Input</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Camera className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Mic className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Model Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-xs">Gemini Model</Label>
                  <Select defaultValue="gemini-2.0">
                    <SelectTrigger id="model" className="text-xs">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-2.0" className="text-xs">Gemini 2.0</SelectItem>
                      <SelectItem value="gemini-1.5-flash" className="text-xs">Gemini 1.5 Flash</SelectItem>
                      <SelectItem value="gemini-1.5-pro" className="text-xs">Gemini 1.5 Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="creativity" className="text-xs">Creativity</Label>
                    <span className="text-xs text-muted-foreground">Balanced</span>
                  </div>
                  <Slider
                    id="creativity"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>More Factual</span>
                    <span>More Imaginative</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="safety" className="text-xs">Safety Settings</Label>
                    <p className="text-xs text-muted-foreground">Filter harmful content</p>
                  </div>
                  <Switch id="safety" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Interface Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-xs">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-scroll" className="text-xs">Auto-scroll Chat</Label>
                    <p className="text-xs text-muted-foreground">Automatically scroll to new messages</p>
                  </div>
                  <Switch id="auto-scroll" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Advanced Settings
            </Button>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </aside>
  );
}
