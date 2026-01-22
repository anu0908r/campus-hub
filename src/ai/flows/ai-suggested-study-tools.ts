// use server'

/**
 * @fileOverview AI-powered study tool suggestion flow.
 *
 * - suggestStudyTools - A function that suggests study tools and methods based on course information, notes, and materials.
 * - AISuggestStudyToolsInput - The input type for the suggestStudyTools function.
 * - AISuggestStudyToolsOutput - The return type for the suggestStudyTools function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestStudyToolsInputSchema = z.object({
  courseInformation: z
    .string()
    .describe('Information about the course, including name, description, and learning objectives.'),
  notes: z.string().describe('Study notes related to the course.'),
  material: z
    .string()
    .describe('Any additional study materials relevant to the course.'),
});

export type AISuggestStudyToolsInput = z.infer<
  typeof AISuggestStudyToolsInputSchema
>;

const AISuggestStudyToolsOutputSchema = z.object({
  suggestedTools: z
    .array(z.string())
    .describe(
      'A list of AI-driven recommendations for study tools and methods.'
    ),
});

export type AISuggestStudyToolsOutput = z.infer<
  typeof AISuggestStudyToolsOutputSchema
>;

export async function suggestStudyTools(
  input: AISuggestStudyToolsInput
): Promise<AISuggestStudyToolsOutput> {
  return suggestStudyToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStudyToolsPrompt',
  input: {schema: AISuggestStudyToolsInputSchema},
  output: {schema: AISuggestStudyToolsOutputSchema},
  prompt: `You are an AI-powered study tool advisor. A student will provide you with course information, their notes, and any study material, and your job is to recommend the most effective study tools and methods for the subject matter. 

Course Information: {{{courseInformation}}}

Notes: {{{notes}}}

Material: {{{material}}}

Based on the information provided, suggest a list of study tools and methods that would be most effective for the student. Return a JSON array.`,
});

const suggestStudyToolsFlow = ai.defineFlow(
  {
    name: 'suggestStudyToolsFlow',
    inputSchema: AISuggestStudyToolsInputSchema,
    outputSchema: AISuggestStudyToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
