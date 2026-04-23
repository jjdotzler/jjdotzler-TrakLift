import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ArrowRight, BarChart3, Dumbbell, History, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Log key lifts",
    description: "Track bench press, back squat, hang clean, and dumbbell curls in seconds.",
  },
  {
    icon: History,
    title: "Review history",
    description: "Keep every saved session organized by exercise so you can look back anytime.",
  },
  {
    icon: BarChart3,
    title: "See progress",
    description: "Turn saved lift entries into a simple progress chart for each movement.",
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isSetupComplete, resetOnboarding } = useStore();

  const startOnboarding = () => {
    resetOnboarding();
    setLocation("/onboarding");
  };

  return (
    <div className="min-h-[100dvh] bg-background px-6 py-8">
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Dumbbell className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                TrakLift
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight">
                Track your lifts without the clutter.
              </h1>
              <p className="mx-auto max-w-sm text-base leading-7 text-muted-foreground">
                A compact training log for recording weight, checking history, and seeing progress across your core lifts.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-primary/10 p-4 text-primary">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <p className="text-sm font-medium">
                Your lift data stays on this device using local storage.
              </p>
            </div>
            <div className="space-y-4">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{feature.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="h-14 w-full text-lg font-semibold"
              onClick={startOnboarding}
            >
              Start with your name
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {isSetupComplete && (
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full"
                onClick={() => setLocation("/app")}
              >
                Open my tracker
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}