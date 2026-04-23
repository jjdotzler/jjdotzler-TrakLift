import { useSyncExternalStore } from "react";

export type OnboardingData = {
  name: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedCookies: boolean;
};

export type LiftEntry = {
  id: string;
  exercise: string;
  date: string;
  weight: number;
  createdAt: string;
};

const defaultOnboarding: OnboardingData = {
  name: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedCookies: false,
};

type StoreSnapshot = {
  onboarding: OnboardingData;
  entries: LiftEntry[];
};

const onboardingKey = "traklift_onboarding";
const entriesKey = "traklift_entries";
const listeners = new Set<() => void>();

const readOnboarding = (): OnboardingData => {
  try {
    const saved = localStorage.getItem(onboardingKey);
    return saved ? { ...defaultOnboarding, ...JSON.parse(saved) } : defaultOnboarding;
  } catch {
    return defaultOnboarding;
  }
};

const readEntries = (): LiftEntry[] => {
  try {
    const saved = localStorage.getItem(entriesKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

let snapshot: StoreSnapshot = {
  onboarding: readOnboarding(),
  entries: readEntries(),
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const writeSnapshot = (nextSnapshot: StoreSnapshot) => {
  snapshot = nextSnapshot;
  localStorage.setItem(onboardingKey, JSON.stringify(snapshot.onboarding));
  localStorage.setItem(entriesKey, JSON.stringify(snapshot.entries));
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export function useStore() {
  const { onboarding, entries } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const addEntry = (entry: Omit<LiftEntry, "id" | "createdAt">) => {
    const newEntry: LiftEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeSnapshot({
      onboarding: snapshot.onboarding,
      entries: [...snapshot.entries, newEntry],
    });
  };

  const updateEntry = (id: string, entry: Omit<LiftEntry, "id" | "createdAt">) => {
    writeSnapshot({
      onboarding: snapshot.onboarding,
      entries: snapshot.entries.map((savedEntry) =>
        savedEntry.id === id ? { ...savedEntry, ...entry } : savedEntry,
      ),
    });
  };

  const deleteEntry = (id: string) => {
    writeSnapshot({
      onboarding: snapshot.onboarding,
      entries: snapshot.entries.filter((entry) => entry.id !== id),
    });
  };

  const updateOnboarding = (data: Partial<OnboardingData>) => {
    writeSnapshot({
      onboarding: { ...snapshot.onboarding, ...data },
      entries: snapshot.entries,
    });
  };

  const resetOnboarding = () => {
    writeSnapshot({
      onboarding: defaultOnboarding,
      entries: snapshot.entries,
    });
  };

  const isSetupComplete = !!(
    onboarding.name &&
    onboarding.acceptedTerms &&
    onboarding.acceptedPrivacy &&
    onboarding.acceptedCookies
  );

  return { 
    onboarding, 
    entries, 
    addEntry, 
    updateEntry,
    deleteEntry,
    updateOnboarding, 
    resetOnboarding,
    isSetupComplete 
  };
}
