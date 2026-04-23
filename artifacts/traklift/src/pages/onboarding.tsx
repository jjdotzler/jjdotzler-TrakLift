import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { onboarding, updateOnboarding, isSetupComplete } = useStore();

  const [step, setStep] = useState(0); // 0: Name, 1: Terms, 2: Privacy, 3: Cookies
  const [tempName, setTempName] = useState(onboarding.name);

  useEffect(() => {
    if (isSetupComplete) {
      setLocation("/app");
    }
  }, [isSetupComplete, setLocation]);
  
  if (isSetupComplete) {
    return null;
  }
  
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length >= 2) {
      updateOnboarding({ name: tempName.trim() });
      setStep(1);
    }
  };

  const handleNext = (field: "acceptedTerms" | "acceptedPrivacy" | "acceptedCookies", nextStep?: number) => {
    updateOnboarding({ [field]: true });
    if (nextStep !== undefined) {
      setStep(nextStep);
    } else {
      setLocation("/app");
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TrakLift</h1>
          <p className="text-muted-foreground mt-2 font-medium">Your compact training log</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Welcome</h2>
                  <p className="text-sm text-muted-foreground">What should we call you?</p>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Alex" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="h-12 text-lg"
                      autoFocus
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-md font-semibold"
                    disabled={tempName.trim().length < 2}
                  >
                    Continue
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Terms of Service</h2>
                  <p className="text-sm text-muted-foreground">Please review our terms to continue.</p>
                </div>
                <div className="h-32 bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground overflow-y-auto border border-border/50">
                  <p>By using TrakLift, you agree to track your lifts responsibly. This is a personal tracker, and your data is stored locally on your device. We are not responsible for any lost data if you clear your browser cache.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={onboarding.acceptedTerms}
                    onCheckedChange={(checked) => updateOnboarding({ acceptedTerms: checked === true })}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I accept the Terms of Service
                  </Label>
                </div>
                <Button 
                  onClick={() => handleNext("acceptedTerms", 2)} 
                  className="w-full h-12"
                  disabled={!onboarding.acceptedTerms}
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Privacy Policy</h2>
                  <p className="text-sm text-muted-foreground">How we handle your data.</p>
                </div>
                <div className="h-32 bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground overflow-y-auto border border-border/50">
                  <p>Your privacy is important. TrakLift operates entirely in your browser. We do not send your lifting data to any servers, nor do we track your activity.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="privacy" 
                    checked={onboarding.acceptedPrivacy}
                    onCheckedChange={(checked) => updateOnboarding({ acceptedPrivacy: checked === true })}
                  />
                  <Label htmlFor="privacy" className="text-sm cursor-pointer">
                    I accept the Privacy Policy
                  </Label>
                </div>
                <Button 
                  onClick={() => handleNext("acceptedPrivacy", 3)} 
                  className="w-full h-12"
                  disabled={!onboarding.acceptedPrivacy}
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Cookies</h2>
                  <p className="text-sm text-muted-foreground">Just the essentials.</p>
                </div>
                <div className="h-32 bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground overflow-y-auto border border-border/50">
                  <p>We use local storage (similar to cookies) strictly to save your onboarding state and your exercise entries so they persist between sessions.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="cookies" 
                    checked={onboarding.acceptedCookies}
                    onCheckedChange={(checked) => updateOnboarding({ acceptedCookies: checked === true })}
                  />
                  <Label htmlFor="cookies" className="text-sm cursor-pointer">
                    I accept the use of Local Storage
                  </Label>
                </div>
                <Button 
                  onClick={() => handleNext("acceptedCookies")} 
                  className="w-full h-12"
                  disabled={!onboarding.acceptedCookies}
                >
                  Finish Setup
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
