'use server';
/**
 * @fileOverview An AI agent that generates a creative name and description for an achievement.
 *
 * - generateAchievement - A function that takes a context and creates an achievement.
 * - GenerateAchievementInput - The input type for the function.
 * - GenerateAchievementOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAchievementInputSchema = z.object({
  context: z
    .string()
    .describe('The reason the user is earning this achievement. This may include task priority. For example: "Completed a CRITICAL task: \'Launch the rocket\'" or "Completed the first task: \'Buy groceries\'"'),
});
export type GenerateAchievementInput = z.infer<typeof GenerateAchievementInputSchema>;

const GenerateAchievementOutputSchema = z.object({
  title: z
    .string()
    .describe('A creative, fun, and witty title for the achievement. It should be like a medal or an order, e.g., "The Order of the Empty Inbox" or "The Checkmate Champion". Use a chess theme where appropriate.'),
  description: z
    .string()
    .describe('A short, encouraging description of what the user did to earn this achievement. e.g., "For the heroic act of clearing all your tasks for the day."'),
});
export type GenerateAchievementOutput = z.infer<typeof GenerateAchievementOutputSchema>;

export async function generateAchievement(
  input: GenerateAchievementInput
): Promise<GenerateAchievementOutput> {
  return generateAchievementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAchievementPrompt',
  input: {schema: GenerateAchievementInputSchema},
  output: {schema: GenerateAchievementOutputSchema},
  prompt: `You are the "Grandmaster of Recognition" in the Checkmate app. Your role is to bestow prestigious and witty titles upon users for their accomplishments.

Based on the context provided, invent a creative, fun, and clever title for a medal or an order. The title should have a grand, slightly formal, and sometimes chess-related feel.

Crucially, the grandeur of the title should match the importance of the task. If the context mentions 'CRITICAL', the title should be more epic and significant.

Do not just repeat the context. Be creative.

Context for achievement: {{{context}}}

Example 1 (Normal Task):
Context: Completed the first task: 'Set up development environment'
Output:
{
  "title": "Pawn's First Promotion",
  "description": "For taking the crucial first step on the long board to victory. The journey has begun!"
}

Example 2 (Normal Series):
Context: Completed five tasks, the latest being: 'Draft marketing email'
Output:
{
  "title": "The Knight's Tour",
  "description": "For demonstrating agility and completing a series of five strategic moves across the board."
}

Example 3 (Critical Task):
Context: Completed a CRITICAL task: 'Deploy main feature to production'
Output:
{
  "title": "The Queen's Gambit",
  "description": "For executing a bold and decisive maneuver that has secured a major advantage on the board."
}


Return the response as a JSON object following the defined output schema.`,
});

const generateAchievementFlow = ai.defineFlow(
  {
    name: 'generateAchievementFlow',
    inputSchema: GenerateAchievementInputSchema,
    outputSchema: GenerateAchievementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
