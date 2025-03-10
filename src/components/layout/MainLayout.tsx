
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} />
      
      <main className={cn(
        "flex-1 relative transition-all duration-300 ease-in-out",
        sidebarOpen ? (isMobile ? "ml-0" : "ml-80") : "ml-0"
      )}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "absolute top-4 left-4 z-10 h-8 w-8 rounded-full bg-background border shadow-md flex items-center justify-center transition-all",
            sidebarOpen && !isMobile && "left-[-16px]"
          )}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Import at the top
import { useEffect } from "react";
