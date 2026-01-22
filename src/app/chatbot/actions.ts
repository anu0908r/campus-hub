"use server";

import { studyChatbot, StudyChatbotInput } from "@/ai/flows/study-chatbot";

type ActionResult = {
    success: boolean;
    data?: string;
    error?: string;
};

export async function generateChatbotResponse(input: StudyChatbotInput): Promise<ActionResult> {
    try {
        const result = await studyChatbot(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error generating chatbot response:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred during AI generation." };
    }
}
