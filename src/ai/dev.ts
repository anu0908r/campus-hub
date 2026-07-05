import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import '@/ai/flows/ai-suggested-study-tools.ts';
import '@/ai/flows/study-chatbot.ts';
