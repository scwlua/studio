'use server';

/**
 * @fileOverview An AI agent that suggests a to-do item based on an image.
 *
 * - suggestTaskFromImage - A function that analyzes an image and suggests a task.
 * - SuggestTaskFromImageInput - The input type for the suggestTaskFromImage function.
 * - SuggestTaskFromImageOutput - The return type for the suggestTaskFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestTaskFromImageInput = z.infer<typeof SuggestTaskFromImageInputSchema>;

const SuggestTaskFromImageOutputSchema = z.object({
  task: z.string().describe('A concise to-do item suggested from the image. This could be from OCR or from contextual analysis of the image.'),
});
export type SuggestTaskFromImageOutput = z.infer<typeof SuggestTaskFromImageOutputSchema>;

export async function suggestTaskFromImage(
  input: SuggestTaskFromImageInput
): Promise<SuggestTaskFromImageOutput> {
  return taskFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskFromImagePrompt',
  input: {schema: SuggestTaskFromImageInputSchema},
  output: {schema: SuggestTaskFromImageOutputSchema},
  prompt: `You are an expert at creating concise to-do list items from images.
Analyze the image provided. If there is text, perform OCR and use that to create a to-do item.
If there is no text, analyze the context of the image to suggest a relevant to-do item.
For example, if you see a pile of dirty dishes, suggest "Wash the dishes". If you see a grocery list, extract the items as a to-do.
The to-do item should be a short, actionable phrase.

Image: {{media url=photoDataUri}}`,
});

const taskFromImageFlow = ai.defineFlow(
  {
    name: 'taskFromImageFlow',
    inputSchema: SuggestTaskFromImageInputSchema,
    outputSchema: SuggestTaskFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
