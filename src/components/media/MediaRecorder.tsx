
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Mic, Monitor, StopCircle, Loader, DownloadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MediaRecorderProps = {
  className?: string;
};

export function MediaRecorder({ className }: MediaRecorderProps) {
  const [activeMedia, setActiveMedia] = useState<"camera" | "screen" | "microphone" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setActiveMedia("camera");
      toast.success("Camera started successfully");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const startScreenShare = async () => {
    try {
      // @ts-ignore - TypeScript doesn't have proper types for getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setActiveMedia("screen");
      toast.success("Screen sharing started successfully");
      
      // Listen for user ending the screen share
      const tracks = stream.getTracks();
      tracks[0].onended = () => {
        stopMedia();
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
      toast.error("Failed to share screen. Please check permissions.");
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setActiveMedia("microphone");
      toast.success("Microphone started successfully");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const stopMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setActiveMedia(null);
    
    if (isRecording) {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: activeMedia === "microphone" ? "audio/webm" : "video/webm",
      });
      setRecordedBlob(blob);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    startTimer();
    toast.success("Recording started");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      toast.success("Recording stopped");
    }
  };

  const downloadRecording = () => {
    if (!recordedBlob) return;
    
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${activeMedia}-recording.webm`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMedia();
      stopTimer();
    };
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 p-4 grid grid-rows-[auto_1fr] gap-4">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={activeMedia === "camera" ? "default" : "outline"}
              size="sm"
              onClick={activeMedia === "camera" ? stopMedia : startCamera}
              className="gap-1.5 text-xs"
            >
              <Camera className="h-3.5 w-3.5" />
              {activeMedia === "camera" ? "Stop Camera" : "Camera"}
            </Button>
            
            <Button
              variant={activeMedia === "screen" ? "default" : "outline"}
              size="sm"
              onClick={activeMedia === "screen" ? stopMedia : startScreenShare}
              className="gap-1.5 text-xs"
            >
              <Monitor className="h-3.5 w-3.5" />
              {activeMedia === "screen" ? "Stop Sharing" : "Screen Share"}
            </Button>
            
            <Button
              variant={activeMedia === "microphone" ? "default" : "outline"}
              size="sm"
              onClick={activeMedia === "microphone" ? stopMedia : startMicrophone}
              className="gap-1.5 text-xs"
            >
              <Mic className="h-3.5 w-3.5" />
              {activeMedia === "microphone" ? "Stop Mic" : "Microphone"}
            </Button>
          </div>
          
          {activeMedia && (
            <div className="flex gap-2">
              {isRecording ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopRecording}
                  className="gap-1.5 text-xs"
                >
                  <StopCircle className="h-3.5 w-3.5" />
                  Stop Recording ({formatTime(recordingTime)})
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={startRecording}
                  className="gap-1.5 text-xs"
                >
                  <Loader className="h-3.5 w-3.5" />
                  Record
                </Button>
              )}
              
              {recordedBlob && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadRecording}
                  className="gap-1.5 text-xs"
                >
                  <DownloadCloud className="h-3.5 w-3.5" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
        
        <Card className="border relative flex items-center justify-center bg-muted/40">
          {activeMedia === "camera" || activeMedia === "screen" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="max-w-full max-h-full rounded-md"
            />
          ) : activeMedia === "microphone" ? (
            <div className="text-center">
              <Mic className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isRecording 
                  ? `Microphone recording in progress (${formatTime(recordingTime)})...` 
                  : "Microphone active"}
              </p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <Camera className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Camera</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start your webcam to record video
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Monitor className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Screen Share</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your screen or application
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Mic className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Microphone</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Record audio from your microphone
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <StopCircle className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Recording</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Record and save media to your device
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Select a media source to get started
              </p>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs animate-pulse-slow">
              REC {formatTime(recordingTime)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
