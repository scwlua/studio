'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { goalDecomposition, GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';
import { BrainCircuit, Calendar, Check, Link, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export interface CampaignPlan {
  goal: string;
  moves: Array<{
    task: string;
    dueDate: string;
    resources: string[];
  }>;
}

interface CampaignCreatorProps {
  onPlanApproved: (plan: CampaignPlan) => void;
}

export function CampaignCreator({ onPlanApproved }: CampaignCreatorProps) {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decomposedPlan, setDecomposedPlan] = useState<GoalDecompositionOutput | null>(null);
  const { toast } = useToast();

  const handleDecomposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setIsLoading(true);
    setDecomposedPlan(null);

    try {
      const result = await goalDecomposition({ goal });
      setDecomposedPlan(result);
    } catch (error: any) {
      console.error(error);
      const isServiceUnavailable = error.message && error.message.includes('503');
      toast({
        title: isServiceUnavailable ? "AI Service Unavailable" : "Error Creating Plan",
        description: isServiceUnavailable 
          ? "The AI planner is currently busy. Please try again in a moment."
          : "Failed to create campaign plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePlan = () => {
    if (decomposedPlan && decomposedPlan.moves && goal) {
      onPlanApproved({ goal, moves: decomposedPlan.moves });
      toast({
        title: "Campaign Created!",
        description: `The "${goal}" campaign has been added to your board.`,
      });
    }
    setDecomposedPlan(null);
    setGoal('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wand2 className="text-primary" />
          The Opening Gambit
        </CardTitle>
        <CardDescription>
          State your objective. The Grandmaster AI will devise a strategic plan to achieve it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDecomposition} className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="e.g., Plan a 2-week trip to Japan for next spring" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !goal}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Plan Moves"}
          </Button>
        </form>

        {isLoading && (
          <div className="mt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
            <BrainCircuit className="animate-pulse text-primary" />
            <span>The Grandmaster is thinking...</span>
          </div>
        )}

        {decomposedPlan && decomposedPlan.moves && decomposedPlan.moves.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold font-headline mb-3">Suggested Campaign for "{goal}":</h3>
            <div className="space-y-4 rounded-lg border bg-secondary/30 p-4">
              {decomposedPlan.moves.map((move, index) => (
                <div key={index} className="transition-all animate-in fade-in-50 slide-in-from-bottom-2">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      {index < decomposedPlan.moves.length - 1 && (
                        <div className="w-px h-4 bg-border mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{move.task}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{move.dueDate}</span>
                          </div>
                      </div>
                      {move.resources && move.resources.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold text-xs mb-1.5 text-muted-foreground">Resources:</h4>
                          <ul className="space-y-1">
                            {move.resources.map((resource, rIndex) => (
                              <li key={rIndex} className="flex items-center gap-2 text-sm">
                                <Link className="h-3 w-3 text-primary/80"/>
                                <span>{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleApprovePlan}>Approve Plan</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
