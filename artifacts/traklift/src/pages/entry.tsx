import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Save, List, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const EXERCISES: Record<string, string> = {
  "bench-press": "Bench Press",
  "back-squat": "Back Squat",
  "hang-clean": "Hang Clean",
  "db-curls": "DB Curls",
};

export default function Entry() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const exerciseId = params.exercise || "";
  const exerciseName = EXERCISES[exerciseId];
  const { addEntry, isSetupComplete } = useStore();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [weight, setWeight] = useState("");

  useEffect(() => {
    if (!isSetupComplete) {
      setLocation("/onboarding");
      return;
    }

    if (!exerciseName) {
      setLocation("/app");
    }
  }, [exerciseName, isSetupComplete, setLocation]);

  if (!isSetupComplete || !exerciseName) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight || isNaN(Number(weight))) return;
    
    addEntry({
      exercise: exerciseId,
      date,
      weight: Number(weight)
    });
    
    setLocation(`/success/${exerciseId}`);
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-12 flex flex-col">
      <header className="pt-10 pb-4 px-4 sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
        <div className="max-w-md mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app")} className="mr-2 shrink-0">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Entry</p>
            <h1 className="text-xl font-bold">{exerciseName}</h1>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 flex-1 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border rounded-2xl p-6 shadow-sm mb-8"
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">Weight</Label>
              <div className="relative">
                <Input 
                  id="weight" 
                  type="number" 
                  step="0.5"
                  inputMode="decimal"
                  placeholder="0.0" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  className="h-16 text-3xl font-bold pr-16 text-center"
                  autoFocus
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  lbs
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold shadow-md active:scale-[0.98] transition-transform" disabled={!weight || isNaN(Number(weight))}>
              <Save className="mr-2 h-5 w-5" />
              Save Lift
            </Button>
          </form>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 hover:bg-primary/5" onClick={() => setLocation(`/entries/${exerciseId}`)}>
            <List className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs">History</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 hover:bg-primary/5" onClick={() => setLocation(`/chart/${exerciseId}`)}>
            <LineChart className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs">Progress</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
