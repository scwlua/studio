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

const InternalInputSchema = GoalDecompositionInputSchema.extend({
  currentDate: z.string().describe('The current date.'),
});

const MoveSchema = z.object({
  task: z.string().describe('The description of the task.'),
  dueDate: z
    .string()
    .describe(
      'A suggested due date for the task, which can be a relative date (e.g., "in 2 weeks") or a specific date.'
    ),
  resources: z
    .array(z.string())
    .describe(
      'A list of suggested resources, websites, or actions to help accomplish the task.'
    ),
});

const GoalDecompositionOutputSchema = z.object({
  moves: z
    .array(MoveSchema)
    .describe(
      'The sequenced list of moves (tasks) decomposed from the high-level goal.'
    ),
});
export type GoalDecompositionOutput = z.infer<
  typeof GoalDecompositionOutputSchema
>;

export async function goalDecomposition(
  input: GoalDecompositionInput
): Promise<GoalDecompositionOutput> {
  return goalDecompositionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalDecompositionPrompt',
  input: {schema: InternalInputSchema},
  output: {schema: GoalDecompositionOutputSchema},
  prompt: `You are an expert project manager and strategic planner. Your job is to take a high-level goal and decompose it into a sequence of actionable "moves" (tasks).

For each move, you must provide:
1.  A clear 'task' description.
2.  A suggested 'dueDate' (e.g., "in 1 week", "by next Friday", "on 2024-12-25").
3.  An array of helpful 'resources' (e.g., "Look up flights on Google Flights", "Use Agoda.com to find hotels", "Read articles on effective marketing").

The moves should be in a logical order of execution. Be creative and insightful with your suggestions.

Today's date is {{{currentDate}}}. **All suggested 'dueDate' values MUST be in the future, after today's date.**

Goal: {{{goal}}}

Return the response as a JSON object following the defined output schema.`,
});

const goalDecompositionFlow = ai.defineFlow(
  {
    name: 'goalDecompositionFlow',
    inputSchema: GoalDecompositionInputSchema,
    outputSchema: GoalDecompositionOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      currentDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
    return output!;
  }
);