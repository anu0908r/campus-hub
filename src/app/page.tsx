import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, FolderKanban, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Courses",
    description: "Access your course materials and schedules.",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    href: "/courses",
  },
  {
    title: "Notes",
    description: "Upload, manage, and review your study notes.",
    icon: <FileText className="w-8 h-8 text-primary" />,
    href: "/notes",
  },
  {
    title: "Resources",
    description: "Explore a centralized hub of study resources.",
    icon: <FolderKanban className="w-8 h-8 text-primary" />,
    href: "/resources",
  },
  {
    title: "AI Study Tools",
    description: "Get personalized study tool recommendations.",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    href: "/study-tools",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Welcome to Campus Hub</h1>
        <p className="text-muted-foreground text-lg">Your all-in-one portal for academic success.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={feature.href}>
                  Go to {feature.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Supercharge Your Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Leverage the power of AI to get personalized recommendations for study tools and methods.
            Simply provide your course details, notes, and materials to get started.
          </p>
          <Button asChild>
            <Link href="/study-tools">
              <Sparkles className="mr-2 h-4 w-4" />
              Try the AI Study Tool Generator
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
