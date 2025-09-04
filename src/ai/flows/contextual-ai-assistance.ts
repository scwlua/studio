'use server';

/**
 * @fileOverview Provides contextual assistance for tasks by suggesting relevant files from Google Drive and external resources.
 *
 * - provideContextualAssistance - A function that takes a task description and provides suggestions.
 * - ContextualAssistanceInput - The input type for the provideContextualAssistance function.
 * - ContextualAssistanceOutput - The return type for the provideContextualAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualAssistanceInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which assistance is needed.'),
});
export type ContextualAssistanceInput = z.infer<typeof ContextualAssistanceInputSchema>;

const ContextualAssistanceOutputSchema = z.object({
  suggestedFiles: z.array(z.string()).describe('List of suggested file names from Google Drive.'),
  suggestedResources: z.array(z.string()).describe('List of suggested external resources (URLs or descriptions).'),
});
export type ContextualAssistanceOutput = z.infer<typeof ContextualAssistanceOutputSchema>;

export async function provideContextualAssistance(
  input: ContextualAssistanceInput
): Promise<ContextualAssistanceOutput> {
  return contextualAssistanceFlow(input);
}

const contextualAssistancePrompt = ai.definePrompt({
  name: 'contextualAssistancePrompt',
  input: {schema: ContextualAssistanceInputSchema},
  output: {schema: ContextualAssistanceOutputSchema},
  prompt: `You are an AI assistant helping users with their tasks. Given the task description, suggest relevant files from the user's Google Drive and external resources that could be helpful in completing the task.

Task Description: {{{taskDescription}}}

Provide the suggestions in the following format:
{
  "suggestedFiles": ["file1.pdf", "file2.docx"],
  "suggestedResources": ["https://example.com/resource1", "Article about the task"]
}
`,
});

const contextualAssistanceFlow = ai.defineFlow(
  {
    name: 'contextualAssistanceFlow',
    inputSchema: ContextualAssistanceInputSchema,
    outputSchema: ContextualAssistanceOutputSchema,
  },
  async input => {
    const {output} = await contextualAssistancePrompt(input);
    return output!;
  }
);
