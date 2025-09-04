'use server';
/**
 * @fileOverview An AI agent that identifies consistently postponed tasks and offers helpful prompts to combat procrastination.
 *
 * - proactiveProcrastinationAssistant - A function that analyzes tasks and suggests solutions for procrastination.
 * - ProactiveProcrastinationAssistantInput - The input type for the proactiveProcrastinationAssistant function.
 * - ProactiveProcrastinationAssistantOutput - The return type for the proactiveProcrastinationAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProactiveProcrastinationAssistantInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task.'),
  taskDescription: z.string().describe('A detailed description of the task.'),
  deferralCount: z.number().describe('The number of times the task has been deferred.'),
});
export type ProactiveProcrastinationAssistantInput = z.infer<
  typeof ProactiveProcrastinationAssistantInputSchema
>;

const ProactiveProcrastinationAssistantOutputSchema = z.object({
  procrastinationDetected: z.boolean().describe('Whether procrastination is detected.'),
  suggestedCounterMove: z
    .string()
    .describe('A suggestion to break down the task or a helpful prompt.'),
});
export type ProactiveProcrastinationAssistantOutput = z.infer<
  typeof ProactiveProcrastinationAssistantOutputSchema
>;

export async function proactiveProcrastinationAssistant(
  input: ProactiveProcrastinationAssistantInput
): Promise<ProactiveProcrastinationAssistantOutput> {
  return proactiveProcrastinationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proactiveProcrastinationAssistantPrompt',
  input: {schema: ProactiveProcrastinationAssistantInputSchema},
  output: {schema: ProactiveProcrastinationAssistantOutputSchema},
  prompt: `You are an AI assistant designed to help users overcome procrastination.

You will analyze the provided task information and determine if the user is likely procrastinating.

If a task has been deferred more than twice, you should set procrastinationDetected to true and provide a helpful suggestion to break down the task into smaller steps or offer a motivational prompt.

If the task has not been deferred more than twice, you should set procrastinationDetected to false and suggest an encouraging message.

Task Title: {{{taskTitle}}}
Task Description: {{{taskDescription}}}
Deferral Count: {{{deferralCount}}}

Output your response in JSON format.  Make sure to set procrastinationDetected to true or false.
`,
});

const proactiveProcrastinationAssistantFlow = ai.defineFlow(
  {
    name: 'proactiveProcrastinationAssistantFlow',
    inputSchema: ProactiveProcrastinationAssistantInputSchema,
    outputSchema: ProactiveProcrastinationAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
