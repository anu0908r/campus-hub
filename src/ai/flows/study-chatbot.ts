'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({text: z.string()})),
});

export const StudyChatbotInputSchema = z.object({
  history: z.array(MessageSchema),
});
export type StudyChatbotInput = z.infer<typeof StudyChatbotInputSchema>;

export const StudyChatbotOutputSchema = z.string();
export type StudyChatbotOutput = z.infer<typeof StudyChatbotOutputSchema>;

const studyChatbotFlow = ai.defineFlow(
  {
    name: 'studyChatbotFlow',
    inputSchema: StudyChatbotInputSchema,
    outputSchema: StudyChatbotOutputSchema,
  },
  async (input) => {
    const systemPrompt = `You are a helpful study assistant. Your name is CampusBot. You can answer questions about academic topics. If the user asks about anything other than academic topics, you should politely decline to answer and remind them of your purpose.`;

    const {output} = await ai.generate({
        prompt: input.history[input.history.length-1].content,
        history: input.history.slice(0, -1),
        system: systemPrompt,
    });

    return output! as string;
  }
);

export async function studyChatbot(input: StudyChatbotInput): Promise<StudyChatbotOutput> {
    return await studyChatbotFlow(input);
}
