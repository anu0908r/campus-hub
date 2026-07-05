'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, Sparkles, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiatePasswordReset } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const features = [
  { icon: BookOpen, title: 'Course Access', desc: 'All your courses in one place' },
  { icon: Sparkles, title: 'AI Study Tools', desc: 'Personalized study recommendations' },
  { icon: Bot, title: 'CampusBot', desc: '24/7 AI-powered study assistant' },
];

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const normalizedEmail = normalizeEmail(values.email);

    try {
      await initiateEmailSignIn(auth, normalizedEmail, values.password);
      form.reset();
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        let errorMessage = 'An unknown error occurred.';
        if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(error.code)) {
          errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed login attempts. Please try again later.';
        }
        toast({ title: 'Authentication Failed', description: errorMessage, variant: 'destructive' });
      }
    }
  };

  const onForgotPassword = async () => {
    const emailInput = form.getValues('email');
    const normalizedEmail = normalizeEmail(emailInput);

    if (!normalizedEmail) {
      toast({
        title: 'Email required',
        description: 'Enter your email address first, then click Forgot password again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await initiatePasswordReset(auth, normalizedEmail);
      toast({
        title: 'Reset email sent',
        description: 'If this email exists, you will receive password reset instructions shortly.',
      });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/invalid-email') {
        toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
        return;
      }

      toast({
        title: 'Unable to send reset email',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold font-headline">Campus Hub</span>
          </div>
          <p className="text-white/60 text-sm">Academic Excellence Portal</p>
        </div>
        <div className="relative space-y-6">
          <div>
            <h2 className="text-3xl font-bold font-headline leading-tight mb-3">
              Everything you need for academic success
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Access your courses, notes, resources, and AI-powered study tools in one seamless platform.
            </p>
          </div>
          <div className="space-y-4">
            {features.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-white/60 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/40 text-xs">© 2026 Campus Hub. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-headline">Campus Hub</span>
          </div>

          <div className="mb-8">
            <h1 className="font-headline text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Campus Hub account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <button type="button" onClick={onForgotPassword} className="text-xs text-primary hover:underline">Forgot password?</button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-10 font-medium" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
