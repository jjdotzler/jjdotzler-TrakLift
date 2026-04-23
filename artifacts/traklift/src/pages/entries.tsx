import { useLocation, useParams } from "wouter";
import { useEffect, useState, type FormEvent } from "react";
import { type LiftEntry, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Dumbbell, Calendar, Pencil, Trash2, Save } from "lucide-react";
import { format, parseISO } from "date-fns";

const EXERCISES: Record<string, string> = {
  "bench-press": "Bench Press",
  "back-squat": "Back Squat",
  "hang-clean": "Hang Clean",
  "db-curls": "DB Curls",
};

export default function Entries() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const exerciseId = params.exercise || "";
  const exerciseName = EXERCISES[exerciseId];
  const { entries, updateEntry, deleteEntry, isSetupComplete } = useStore();
  const [editingEntry, setEditingEntry] = useState<LiftEntry | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editWeight, setEditWeight] = useState("");

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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startEditing = (entry: LiftEntry) => {
    setEditingEntry(entry);
    setEditDate(entry.date);
    setEditWeight(String(entry.weight));
  };

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingEntry || !editDate || !editWeight || isNaN(Number(editWeight))) return;

    updateEntry(editingEntry.id, {
      exercise: editingEntry.exercise,
      date: editDate,
      weight: Number(editWeight),
    });

    setEditingEntry(null);
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="pt-10 pb-4 px-4 sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
        <div className="max-w-md mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setLocation(`/track/${exerciseId}`)} className="mr-2 shrink-0">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">History</p>
            <h1 className="text-xl font-bold">{exerciseName}</h1>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 max-w-md mx-auto">
        {exerciseEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Dumbbell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No entries yet</h2>
            <p className="text-muted-foreground text-sm mb-6">You haven't tracked any {exerciseName.toLowerCase()} sessions yet.</p>
            <Button onClick={() => setLocation(`/track/${exerciseId}`)}>Track First Lift</Button>
          </div>
        ) : (
          <div className="space-y-3 pb-12">
            {exerciseEntries.map((entry) => (
              <div key={entry.id} className="bg-card border rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center min-w-0">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4 shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{format(parseISO(entry.date), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{format(parseISO(entry.createdAt), "h:mm a")}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold">{entry.weight}</span>
                    <span className="text-sm text-muted-foreground font-medium ml-1">lbs</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => startEditing(entry)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this lift?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the {entry.weight} lb {exerciseName.toLowerCase()} entry from {format(parseISO(entry.date), "MMM d, yyyy")}. Your progress chart will update right away.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEntry(entry.id)} className="bg-destructive text-destructive-foreground border-destructive-border">
                          Delete Entry
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg">
          <DialogHeader>
            <DialogTitle>Edit lift entry</DialogTitle>
            <DialogDescription>
              Correct the date or weight for this {exerciseName.toLowerCase()} session. Your progress chart will use the updated entry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(event) => setEditDate(event.target.value)}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weight">Weight</Label>
              <div className="relative">
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.5"
                  inputMode="decimal"
                  value={editWeight}
                  onChange={(event) => setEditWeight(event.target.value)}
                  className="h-14 text-2xl font-bold pr-16 text-center"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  lbs
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!editDate || !editWeight || isNaN(Number(editWeight))}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
