import { useLocation } from "wouter";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EXERCISES = [
  { id: "bench-press", name: "Bench Press", color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  { id: "back-squat", name: "Back Squat", color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400" },
  { id: "hang-clean", name: "Hang Clean", color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" },
  { id: "db-curls", name: "DB Curls", color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { onboarding, resetOnboarding, isSetupComplete } = useStore();

  useEffect(() => {
    if (!isSetupComplete) {
      setLocation("/onboarding");
    }
  }, [isSetupComplete, setLocation]);

  if (!isSetupComplete) return null;

  const handleReturnToNameEntry = () => {
    resetOnboarding();
    setLocation("/onboarding");
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-12">
      <header className="pt-12 pb-6 px-6 bg-card border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Welcome back
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              Ready to lift, {onboarding.name}?
            </h1>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Dumbbell className="h-6 w-6" />
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 max-w-md mx-auto">
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Exercise</h2>
            <p className="text-muted-foreground text-sm">Choose what you want to track today.</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReturnToNameEntry}
          >
            Change name
          </Button>
        </div>

        <div className="grid gap-4">
          {EXERCISES.map((exercise, i) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className="hover-elevate cursor-pointer border-border/50 hover:border-primary/30 transition-colors overflow-hidden group"
                onClick={() => setLocation(`/track/${exercise.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 ${exercise.color}`}>
                      <Dumbbell className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
