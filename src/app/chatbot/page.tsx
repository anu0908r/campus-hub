"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, User, Bot, Trash2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateChatbotResponse } from "./actions";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp, query, orderBy, deleteDoc, getDocs } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: any;
  userId: string;
};

const quickPrompts = [
  "Explain the scientific method",
  "Help me understand derivatives",
  "What is narrative structure?",
  "Summarize world war 2",
];

export default function ChatbotPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, "users", user.uid, "chat_messages"), orderBy("timestamp", "asc"));
  }, [firestore, user]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleQuickPrompt = (prompt: string) => {
    form.setValue("message", prompt);
    form.handleSubmit(onSubmit)();
  };

  const handleClearChat = async () => {
    if (!user) return;
    setIsClearing(true);
    try {
      const messagesRef = collection(firestore, "users", user.uid, "chat_messages");
      const snapshot = await getDocs(messagesRef);
      await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
      toast({ title: "Chat cleared", description: "Your conversation history has been deleted." });
    } catch {
      toast({ title: "Failed to clear chat", variant: "destructive" });
    }
    setIsClearing(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "You must be logged in to chat.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    const messagesRef = collection(firestore, "users", user.uid, "chat_messages");

    addDocumentNonBlocking(messagesRef, {
      text: values.message,
      isUser: true,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
    form.reset();

    const history = (messages || []).map(msg => ({
      role: (msg.isUser ? "user" : "model") as "user" | "model",
      content: [{ text: msg.text }],
    }));
    history.push({ role: "user" as const, content: [{ text: values.message }] });

    const result = await generateChatbotResponse({ history });

    if (result.success && result.data) {
      addDocumentNonBlocking(messagesRef, {
        text: result.data,
        isUser: false,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } else {
      toast({
        title: "AI Generation Failed",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }

    setIsGenerating(false);
  }

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-10rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            CampusBot
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">AI Online</Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your intelligent study assistant — ask anything academic!</p>
        </div>
        {hasMessages && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={isClearing}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            {isClearing ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
            Clear chat
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/60 min-h-0">
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {/* Welcome Message */}
              {!isLoading && !hasMessages && (
                <div className="flex flex-col items-center justify-center py-8 gap-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                    <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl border border-primary/20">
                      <Bot className="w-12 h-12 text-primary mx-auto" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold mb-1">Hello! I'm CampusBot 👋</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                      I'm your AI-powered study assistant. Ask me anything — from explaining complex concepts to helping you prepare for exams.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                    {quickPrompts.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex items-end gap-2.5", message.isUser ? "justify-end" : "justify-start")}
                >
                  {!message.isUser && (
                    <Avatar className="h-7 w-7 flex-shrink-0 mb-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl whitespace-pre-wrap shadow-sm",
                      message.isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border/60 text-foreground rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  {message.isUser && (
                    <Avatar className="h-7 w-7 flex-shrink-0 mb-0.5">
                      <AvatarFallback className="bg-secondary text-xs">
                        <User className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-end gap-2.5 justify-start">
                  <Avatar className="h-7 w-7 flex-shrink-0 mb-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <Bot className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border border-border/60 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t bg-muted/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Ask CampusBot anything..."
                        autoComplete="off"
                        className="bg-background rounded-xl border-border/60"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isGenerating} className="rounded-xl flex-shrink-0">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
