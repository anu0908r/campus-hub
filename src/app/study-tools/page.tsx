import { StudyToolsForm } from "./components/study-tools-form";
import { courses } from "@/lib/mock-data";

export default function StudyToolsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">AI Study Tool Generator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Stuck on how to study for a course? Provide your course info, notes, and materials, and our AI will suggest the most effective study tools and methods for you.
                </p>
            </div>
            <StudyToolsForm courses={courses} />
        </div>
    );
}
