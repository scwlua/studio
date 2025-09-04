// GoalDecomposition
'use server';
/**
 * @fileOverview Goal decomposition AI agent.
 *
 * - goalDecomposition - A function that handles the goal decomposition process.
 * - GoalDecompositionInput - The input type for the goalDecomposition function.
 * - GoalDecompositionOutput - The return type for the goalDecomposition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalDecompositionInputSchema = z.object({
  goal: z.string().describe('The high-level goal to be decomposed.'),
});
export type GoalDecompositionInput = z.infer<typeof GoalDecompositionInputSchema>;

const GoalDecompositionOutputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('The list of tasks decomposed from the high-level goal.'),
});
export type GoalDecompositionOutput = z.infer<typeof GoalDecompositionOutputSchema>;

export async function goalDecomposition(input: GoalDecompositionInput): Promise<GoalDecompositionOutput> {
  return goalDecompositionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalDecompositionPrompt',
  input: {schema: GoalDecompositionInputSchema},
  output: {schema: GoalDecompositionOutputSchema},
  prompt: `You are an expert project manager. Your job is to take a high-level goal and decompose it into a list of actionable tasks.

Goal: {{{goal}}}

Tasks:`,
});

const goalDecompositionFlow = ai.defineFlow(
  {
    name: 'goalDecompositionFlow',
    inputSchema: GoalDecompositionInputSchema,
    outputSchema: GoalDecompositionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
