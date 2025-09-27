'use client';

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Clock, Info, BrainCircuit, Calendar, Link as LinkIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { proactiveProcrastinationAssistant, ProactiveProcrastinationAssistantOutput } from "@/ai/flows/proactive-procrastination-assistant";
import { provideContextualAssistance, ContextualAssistanceOutput } from "@/ai/flows/contextual-ai-assistance";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Move } from "@/app/(app)/dashboard/page";
import { achievementsStore } from "@/lib/achievements-store";
import { campaignStore } from "@/lib/campaign-store";

interface TaskCardProps {
  move: Move;
  isFocus?: boolean;
  isQuickWin?: boolean;
}

export function TaskCard({ move, isFocus, isQuickWin }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(move.status === 'Done');
  const [deferralCount, setDeferralCount] = useState(0);
  const [isProcrastinationAlertOpen, setIsProcrastinationAlertOpen] = useState(false);
  const [procrastinationSuggestion, setProcrastinationSuggestion] = useState<ProactiveProcrastinationAssistantOutput | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsCompleted(move.status === 'Done');
  }, [move.status]);

  const handleDefer = async () => {
    const newCount = deferralCount + 1;
    setDeferralCount(newCount);

    toast({
      title: "Move Deferred",
      description: `"${move.title}" has been pushed back.`,
    });

    if (newCount > 1) { // Trigger on second deferral
      const result = await proactiveProcrastinationAssistant({
        taskTitle: move.title,
        taskDescription: `This task is part of the ${move.campaignTitle} campaign and has a ${move.priority} priority.`,
        deferralCount: newCount,
      });
      setProcrastinationSuggestion(result);
      setIsProcrastinationAlertOpen(true);
    }
  };

  const handleComplete = (checked: boolean) => {
    const newStatus = checked ? 'Done' : 'To-Do';
    setIsCompleted(checked);
    campaignStore.updateMoveStatus(move.campaignId, move.id, newStatus);
    
    if(checked) {
      achievementsStore.notifyMoveCompleted(move);
      toast({
        title: "Move Complete!",
        description: `You've completed "${move.title}".`,
      });
    }
  };

  const priorityColors = {
    Critical: "border-primary/50 bg-primary/10 text-primary",
    High: "border-orange-400/50 bg-orange-400/10 text-orange-400",
    Normal: "border-accent-foreground/20 bg-accent/10 text-muted-foreground",
  };

  if (!move) return null;

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 p-2.5 rounded-lg border bg-card transition-all hover:bg-secondary/60",
          isCompleted && "bg-secondary/40 opacity-50",
          isFocus && "border-primary/50 shadow-sm shadow-primary/20"
        )}
      >
        <Checkbox
          id={`task-${move.id}`}
          checked={isCompleted}
          onCheckedChange={(checked) => handleComplete(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
          className="transition-all rounded-[4px] data-[state=checked]:bg-primary"
        />
        <div className="flex-1 cursor-pointer" onClick={() => setIsDetailsModalOpen(true)}>
          <p className={cn("text-sm font-medium", isCompleted && "line-through")}>
            {move.title}
          </p>
          {move.dueDate && (
             <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                <Calendar className="h-3 w-3" />
                {move.dueDate}
            </p>
          )}
        </div>
        <Badge variant="outline" className={cn("hidden sm:inline-flex text-xs", priorityColors[move.priority])}>
          {move.priority}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-md"
          onClick={(e) => { e.stopPropagation(); handleDefer(); }}
        >
          <Clock className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <AlertDialog open={isProcrastinationAlertOpen} onOpenChange={setIsProcrastinationAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline"><BrainCircuit className="text-primary"/>Threat Analysis</AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              The Grandmaster notices '{move.title}' has been deferred again.
              <br/><br/>
              <strong>Suggestion:</strong> {procrastinationSuggestion?.suggestedCounterMove || "Let's find a new angle."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <AlertDialogAction>Okay, I'll try</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{move.title}</DialogTitle>
            <DialogDescription>
              Campaign: {move.campaignTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             {move.dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Due: {move.dueDate}
                </div>
             )}
             {move.resources && move.resources.length > 0 && (
                <div>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Suggested Resources</h4>
                     <ul className="list-inside space-y-1 text-sm pl-2">
                        {move.resources.map((res, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <LinkIcon className="h-3 w-3 text-primary/80"/>
                                {res}
                            </li>)
                        )}
                    </ul>
                </div>
             )}

            <ResourceReconnaissance taskDescription={move.title} isOpen={isDetailsModalOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResourceReconnaissance({ taskDescription, isOpen }: { taskDescription: string, isOpen: boolean }) {
  const [assistance, setAssistance] = useState<ContextualAssistanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAssistance(null); // Clear previous results when dialog is closed
      return;
    }
    let isCancelled = false;

    async function fetchAssistance() {
      setIsLoading(true);
      try {
        const result = await provideContextualAssistance({ taskDescription });
        if (!isCancelled) {
          setAssistance(result);
        }
      } catch (error) {
        console.error("Failed to get assistance", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchAssistance();

    return () => {
      isCancelled = true;
    }
  }, [isOpen, taskDescription]);

  return (
    <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
      <h3 className="font-semibold flex items-center gap-2 text-base"><Info className="text-primary h-5 w-5" /> Resource Reconnaissance</h3>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      ) : (
        <div className="space-y-4">
          {assistance?.suggestedFiles && assistance.suggestedFiles.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Suggested Files from Drive</h4>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                {assistance.suggestedFiles.map((file, i) => <li key={i}>{file}</li>)}
              </ul>
            </div>
          )}
          {assistance?.suggestedResources && assistance.suggestedResources.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Other Suggested Resources</h4>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                 {assistance.suggestedResources.map((res, i) => <li key={i}>{res}</li>)}
              </ul>
            </div>
          )}
          {(!assistance?.suggestedFiles || assistance.suggestedFiles.length === 0) && (!assistance?.suggestedResources || assistance.suggestedResources.length === 0) && !isLoading && (
            <p className="text-sm text-muted-foreground">No additional resources found for this task.</p>
          )}
        </div>
      )}
    </div>
  );
}
