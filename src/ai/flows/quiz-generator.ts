'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIQuizGeneratorInputSchema = z.object({
  topic: z.string().describe('The main topic for the quiz.'),
  material: z.string().optional().describe('Source material or text to base the quiz on.'),
  numQuestions: z.number().min(1).max(20).default(5).describe('Number of questions to generate.'),
});

export type AIQuizGeneratorInput = z.infer<typeof AIQuizGeneratorInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The text of the question.'),
  options: z.array(z.string()).length(4).describe('Four multiple-choice options.'),
  correctAnswer: z.number().min(0).max(3).describe('Index of the correct option (0-3).'),
  explanation: z.string().describe('Explanation of why the answer is correct.'),
});

const AIQuizGeneratorOutputSchema = z.object({
  title: z.string().describe('A catchy title for the quiz.'),
  questions: z.array(QuizQuestionSchema).describe('List of generated questions.'),
});

export type AIQuizGeneratorOutput = z.infer<typeof AIQuizGeneratorOutputSchema>;

export async function generateQuiz(
  input: AIQuizGeneratorInput
): Promise<AIQuizGeneratorOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: AIQuizGeneratorInputSchema },
  output: { schema: AIQuizGeneratorOutputSchema },
  prompt: `You are an expert AI educator. Your task is to generate a multiple-choice quiz based on the provided topic and material.
  
Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}
Source Material: {{#if material}}{{{material}}}{{else}}Use your general knowledge about the topic.{{/if}}

Please create an engaging quiz with exactly {{{numQuestions}}} questions. Each question must have exactly 4 options, only one of which is correct. Provide a clear explanation for the correct answer. Output the result in the requested JSON format.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: AIQuizGeneratorInputSchema,
    outputSchema: AIQuizGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
