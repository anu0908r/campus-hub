"use server";

import { suggestStudyTools, AISuggestStudyToolsInput, AISuggestStudyToolsOutput } from "@/ai/flows/ai-suggested-study-tools";

type ActionResult = {
    success: boolean;
    data?: AISuggestStudyToolsOutput;
    error?: string;
};

export async function generateStudyTools(input: AISuggestStudyToolsInput): Promise<ActionResult> {
    try {
        const result = await suggestStudyTools(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error generating study tools:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred during AI generation." };
    }
}
