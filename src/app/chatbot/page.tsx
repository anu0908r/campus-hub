"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, Sparkles, User, Bot } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateChatbotResponse } from "./actions";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

export default function ChatbotPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'chat_messages'), orderBy('timestamp', 'asc'));
  }, [firestore, user]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: "You must be logged in to chat.", variant: "destructive" });
        return;
    }
    
    setIsGenerating(true);
    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        text: values.message,
        isUser: true,
        userId: user.uid,
    };
    
    const messagesRef = collection(firestore, 'users', user.uid, 'chat_messages');

    addDocumentNonBlocking(messagesRef, { ...userMessage, timestamp: serverTimestamp() });
    form.reset();

    const history = (messages || []).map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        content: [{ text: msg.text }]
    }));

    history.push({ role: 'user', content: [{ text: values.message }] });

    const result = await generateChatbotResponse({ history });

    if (result.success && result.data) {
      const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        text: result.data,
        isUser: false,
        userId: user.uid,
      };
      addDocumentNonBlocking(messagesRef, { ...botMessage, timestamp: serverTimestamp() });
    } else {
      toast({
        title: "AI Generation Failed",
        description: result.error || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsGenerating(false);
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot /> CampusBot
          </CardTitle>
          <CardDescription>Your friendly AI study assistant. Ask me anything about your courses!</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="space-y-4 pr-4">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {messages?.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-3", message.isUser ? "justify-end" : "justify-start")}>
                            {!message.isUser && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl", message.isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                            {message.isUser && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-3 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted px-4 py-3 rounded-xl">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Ask a question..." autoComplete="off" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isGenerating}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
