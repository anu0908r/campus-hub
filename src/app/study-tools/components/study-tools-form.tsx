"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lightbulb, Sparkles, Brain, CheckCircle2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

const studyToolIcons = ["🎯", "📚", "🧠", "⏰", "✏️", "🗂️", "💡", "🔬", "📝", "🎧"];

export function StudyToolsForm({ courses }: StudyToolsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { courseId: "", notes: "", material: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions([]);

    const selectedCourse = courses.find((c) => c.id === values.courseId);
    if (!selectedCourse) {
      toast({ title: "Error", description: "Selected course not found.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    setSelectedCourseName(selectedCourse.title);

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
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Provide Study Context
          </CardTitle>
          <CardDescription>Fill out the form below to get your personalized AI-generated suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Course *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
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
                    <FormLabel className="font-medium">Your Study Notes *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your study notes here. Be as detailed as possible for better recommendations (minimum 50 characters)."
                        className="min-h-[140px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage />
                      <span className="text-xs text-muted-foreground">{field.value?.length || 0} chars</span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Additional Materials
                      <Badge variant="secondary" className="ml-2 text-xs font-normal">Optional</Badge>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other relevant info? e.g., textbook chapters, assignment details, specific topics."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Generating..." : "Generate Suggestions"}
                </Button>
                {suggestions.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setSuggestions([]); form.reset(); setSelectedCourseName(''); }}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-primary/10 p-4 rounded-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-headline text-xl font-semibold">AI is analyzing your input...</h3>
              <p className="text-muted-foreground text-sm mt-1">Generating personalized study tool suggestions. This may take a moment.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-headline text-xl font-bold">AI Study Suggestions</h2>
              <Badge className="bg-primary/10 text-primary border-0">{suggestions.length} tools</Badge>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              For: <span className="font-medium text-foreground">{selectedCourseName}</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {suggestions.map((tool, index) => (
              <Card key={index} className="border-border/60 card-hover bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                      {studyToolIcons[index % studyToolIcons.length]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-primary/70">Tool #{index + 1}</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      <p className="text-sm leading-relaxed">{tool}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed border-border/60 bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">
                💡 These suggestions are AI-generated based on your notes. Try combining multiple methods for best results.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
