
import { useEffect } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    // Show welcome toast
    toast("Welcome to Gemini AI Assistant", {
      description: "Your intelligent coding companion",
      duration: 5000,
    });
  }, []);

  return (
    <div className="h-full">
      <Dashboard />
    </div>
  );
};

export default Index;
