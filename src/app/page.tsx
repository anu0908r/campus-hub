import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderKanban,
  Bot,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    title: "Courses",
    description: "Access your enrolled course materials and schedules.",
    icon: BookOpen,
    href: "/courses",
    color: "bg-blue-100 text-blue-600",
    badge: "6 courses",
  },
  {
    title: "Notes",
    description: "Upload, manage, and review your study notes.",
    icon: FileText,
    href: "/notes",
    color: "bg-emerald-100 text-emerald-600",
    badge: "4 notes",
  },
  {
    title: "Resources",
    description: "Explore a centralized hub of study materials.",
    icon: FolderKanban,
    href: "/resources",
    color: "bg-purple-100 text-purple-600",
    badge: "4 resources",
  },
  {
    title: "AI Chatbot",
    description: "Chat with an AI study assistant anytime.",
    icon: Bot,
    href: "/chatbot",
    color: "bg-orange-100 text-orange-600",
    badge: "AI powered",
  },
];

const stats = [
  { label: "Courses Enrolled", value: "6", icon: GraduationCap, change: "+2 this term" },
  { label: "Study Notes", value: "4", icon: FileText, change: "+1 this week" },
  { label: "Resources Saved", value: "4", icon: FolderKanban, change: "Always growing" },
  { label: "Study Hours", value: "24h", icon: Clock, change: "This month" },
];

const recentActivity = [
  { action: "Uploaded", item: "React Hooks Explained", course: "Advanced Web Development", time: "2 days ago", icon: FileText },
  { action: "Viewed", item: "MDN Web Docs", course: "Resource Hub", time: "3 days ago", icon: FolderKanban },
  { action: "Enrolled", item: "Music Theory and Composition", course: "New Course", time: "1 week ago", icon: BookOpen },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-2 right-32 w-20 h-20 rounded-full bg-white/20 blur-xl" />
          <div className="absolute top-12 right-48 w-12 h-12 rounded-full bg-white/20 blur-lg" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Academic Year 2025–26</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">
              Welcome back to Campus Hub 👋
            </h1>
            <p className="text-white/80 text-lg max-w-lg">
              Your all-in-one academic portal. Manage courses, notes, resources, and get AI-powered study help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
              <Link href="/study-tools">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Study Tools
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link href="/chatbot">
                <Bot className="mr-2 h-4 w-4" />
                Ask CampusBot
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-hover border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-headline text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-bold">Quick Access</h2>
          <Badge variant="secondary" className="text-xs">All features</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Card key={link.title} className="card-hover border-border/60 group">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${link.color}`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {link.badge}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-base mb-1">{link.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary/5 mt-auto">
                  <Link href={link.href}>
                    <span>Go to {link.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Row: AI Promo + Recent Activity */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* AI Promo */}
        <Card className="lg:col-span-2 border-accent/30 bg-gradient-to-br from-accent/10 to-orange-50 card-hover">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-accent/20 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <Badge className="bg-accent/20 text-accent-foreground border-0 text-xs">AI Powered</Badge>
            </div>
            <CardTitle className="font-headline text-xl">Meet CampusBot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your intelligent study assistant. Ask any academic question, get explanations, and generate personalized study tools tailored to your courses.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {["Explain complex concepts", "Generate study summaries", "Suggest study methods"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href="/chatbot">
                  <Bot className="mr-2 h-3.5 w-3.5" />
                  Start Chat
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/study-tools">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Study Tools
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-headline text-xl">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg mt-0.5 flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      <span className="text-muted-foreground">{activity.action}: </span>
                      {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.course}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl border border-dashed border-border bg-muted/20 text-center">
              <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">More activity will appear as you use Campus Hub</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
