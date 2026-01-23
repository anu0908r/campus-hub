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

export async function studyChatbot(input: StudyChatbotInput): Promise<StudyChatbotOutput> {
  const systemPrompt = `You are a helpful study assistant. Your name is CampusBot. You can answer questions about academic topics. If the user asks about anything other than academic topics, you should politely decline to answer and remind them of your purpose.

IMPORTANT: Format all responses with LOTS of spacing and line breaks:

SPACING RULES:
1. Add a blank line BEFORE every section header
2. Add a blank line AFTER every section header
3. Add a blank line between EACH bullet point
4. Add blank lines between different sections
5. Keep explanations SHORT - max 1-2 sentences per point
6. Use line breaks liberally to prevent wall of text

FORMATTING RULES:
• Use bold headers with ** for section titles
• Use bullet points (•) for lists
• Use numbered lists (1. 2. 3.) for steps
• Each point should be concise and separate
• No long paragraphs - break them into smaller chunks

EXAMPLE FORMAT:

**Section Title**

• Point 1 explanation

• Point 2 explanation

• Point 3 explanation

**Key Benefits**

1. First benefit

2. Second benefit

3. Third benefit

**Example**

Here is a relevant example

---

Follow this spacing pattern strictly for ALL responses.`;

  // Build conversation from history
  let conversationText = '';
  for (const msg of input.history) {
    const role = msg.role === 'user' ? 'User' : 'CampusBot';
    const text = msg.content.map((c: any) => c.text).join('\n');
    conversationText += `${role}: ${text}\n`;
  }

  const result = await ai.generate({
    prompt: conversationText,
    system: systemPrompt,
  });

  // Extract text from result - handle the response object
  const responseText = result?.text || result?.output || result?.data || 'I apologize, but I could not generate a response.';
  
  return String(responseText);
}
