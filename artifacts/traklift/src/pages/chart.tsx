import { useLocation, useParams } from "wouter";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LineChart as ChartIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EXERCISES: Record<string, string> = {
  "bench-press": "Bench Press",
  "back-squat": "Back Squat",
  "hang-clean": "Hang Clean",
  "db-curls": "DB Curls",
};

export default function ChartView() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const exerciseId = params.exercise || "";
  const exerciseName = EXERCISES[exerciseId];
  const { entries, isSetupComplete } = useStore();

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

  const exerciseEntries = entries
    .filter(e => e.exercise === exerciseId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = exerciseEntries.map(e => ({
    date: format(parseISO(e.date), "MMM d"),
    weight: e.weight
  }));

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="pt-10 pb-4 px-4 sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
        <div className="max-w-md mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setLocation(`/track/${exerciseId}`)} className="mr-2 shrink-0">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
            <h1 className="text-xl font-bold">{exerciseName}</h1>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 max-w-md mx-auto flex flex-col">
        {exerciseEntries.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ChartIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Not enough data</h2>
            <p className="text-muted-foreground text-sm mb-6">Track at least two sessions of {exerciseName.toLowerCase()} to see your progress chart.</p>
            <Button onClick={() => setLocation(`/track/${exerciseId}`)}>Track Lift</Button>
          </div>
        ) : (
          <>
            <section aria-label="Progress data" className="sr-only">
              <h2>Progress data</h2>
              <ul>
                {exerciseEntries.map((entry) => (
                  <li key={entry.id}>
                    {format(parseISO(entry.date), "MMM d, yyyy")}: {entry.weight} lbs
                  </li>
                ))}
              </ul>
            </section>
            <div className="bg-card border rounded-2xl p-4 shadow-sm pt-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
