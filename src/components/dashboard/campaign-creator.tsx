'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { goalDecomposition, GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';
import { BrainCircuit, Check, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CampaignCreator() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decomposedTasks, setDecomposedTasks] = useState<GoalDecompositionOutput | null>(null);
  const { toast } = useToast();

  const handleDecomposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setIsLoading(true);
    setDecomposedTasks(null);

    try {
      const result = await goalDecomposition({ goal });
      setDecomposedTasks(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create campaign plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePlan = () => {
    toast({
      title: "Plan Approved!",
      description: "The new moves have been added to your board.",
    });
    setDecomposedTasks(null);
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
            placeholder="e.g., Launch a new marketing website by Q4" 
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

        {decomposedTasks && decomposedTasks.tasks.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold font-headline mb-3">Suggested Moves:</h3>
            <ul className="space-y-2">
              {decomposedTasks.tasks.map((task, index) => (
                <li key={index} className="flex items-start gap-3 bg-secondary/60 p-3 rounded-md transition-all animate-in fade-in-50 slide-in-from-bottom-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="flex-1 text-sm">{task}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <Button onClick={handleApprovePlan}>Approve Plan</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
