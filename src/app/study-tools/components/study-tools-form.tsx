"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateStudyTools } from "../actions";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course."),
  notes: z.string().min(50, "Please provide at least 50 characters of notes."),
  material: z.string().optional(),
});

type StudyToolsFormProps = {
  courses: {
    id: string;
    title: string;
    description: string;
  }[];
};

export function StudyToolsForm({ courses }: StudyToolsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      notes: "",
      material: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions([]);

    const selectedCourse = courses.find((c) => c.id === values.courseId);
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Selected course not found.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const result = await generateStudyTools({
      courseInformation: `Title: ${selectedCourse.title}. Description: ${selectedCourse.description}`,
      notes: values.notes,
      material: values.material || "No additional materials provided.",
    });

    if (result.success && result.data) {
      setSuggestions(result.data.suggestedTools);
    } else {
      toast({
        title: "AI Generation Failed",
        description: result.error || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Provide Study Context</CardTitle>
          <CardDescription>Fill out the form below to get your personalized suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course to get suggestions for" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Study Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your study notes here. Be as detailed as possible for better recommendations."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Materials (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other relevant info? e.g., textbook chapters, assignment details, specific topics you're struggling with."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Suggestions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="font-headline text-xl">Generating suggestions...</h3>
            <p className="text-muted-foreground">The AI is analyzing your input. This might take a moment.</p>
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card className="bg-accent/20 border-accent/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent-foreground" />
              Your AI-Suggested Study Tools
            </CardTitle>
            <CardDescription>Based on your input, here are some recommended tools and methods:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc pl-5 text-accent-foreground/90">
              {suggestions.map((tool, index) => (
                <li key={index} className="pl-2">{tool}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
