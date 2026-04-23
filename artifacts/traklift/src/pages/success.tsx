import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, List } from "lucide-react";
import { motion } from "framer-motion";

export default function Success() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const exerciseId = params.exercise || "";

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 20 }}
        className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
      >
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2 mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight">Lift Saved</h1>
        <p className="text-muted-foreground font-medium">Great work today. Keep it up!</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-3"
      >
        {exerciseId && (
          <Button 
            size="lg" 
            variant="outline"
            className="w-full h-14 text-lg font-semibold group"
            onClick={() => setLocation(`/entries/${exerciseId}`)}
          >
            <List className="mr-2 h-5 w-5" />
            View History
          </Button>
        )}
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold group"
          onClick={() => setLocation("/app")}
        >
          Track Another Lift
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
}
