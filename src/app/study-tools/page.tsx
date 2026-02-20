import { StudyToolsForm } from "./components/study-tools-form";
import { courses } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap } from "lucide-react";

export default function StudyToolsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-8">
                <div className="absolute top-4 right-8 opacity-10">
                    <Brain className="w-32 h-32 text-amber-600" />
                </div>
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-amber-100 p-1.5 rounded-lg">
                            <Sparkles className="h-4 w-4 text-amber-600" />
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            <Zap className="h-2.5 w-2.5 mr-1" />
                            Powered by Gemini AI
                        </Badge>
                    </div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">AI Study Tool Generator</h1>
                    <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
                        Stuck on how to study for a course? Provide your course info, notes, and materials — our AI will suggest the most effective study tools and methods tailored just for you.
                    </p>
                </div>
            </div>

            <StudyToolsForm courses={courses} />
        </div>
    );
}
