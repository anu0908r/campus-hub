'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { getEmailSignInMethods, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const perks = [
  'Access 6+ courses and materials',
  'AI-powered study recommendations',
  'Personal notes repository',
  'Centralized resource hub',
];

export default function SignUpPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const normalizedEmail = normalizeEmail(values.email);

    try {
      const signInMethods = await getEmailSignInMethods(auth, normalizedEmail);
      if (signInMethods.length > 0) {
        toast({
          title: 'Sign-up Failed',
          description: 'This email is already in use. Try signing in instead.',
          variant: 'destructive',
        });
        return;
      }

      const userCredential = await initiateEmailSignUp(auth, normalizedEmail, values.password);
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, {
          id: user.uid,
          email: user.email,
          name: user.email?.split('@')[0] || 'New User',
          registrationDate: new Date().toISOString(),
          role: 'student', // Default role
        }, {});

        toast({ title: 'Account created!', description: 'Welcome to Campus Hub.' });
        form.reset();
        router.push('/');
      }
    } catch (error) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use. Try signing in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use at least 6 characters.';
            break;
        }
      }
      toast({ title: 'Sign-up Failed', description: errorMessage, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white blur-2xl" />
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
              Join thousands of students excelling academically
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Create your free account and unlock a world of academic tools designed to help you succeed.
            </p>
          </div>
          <div className="space-y-3">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <p className="text-sm text-white/80">{perk}</p>
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
            <h1 className="font-headline text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm">Join Campus Hub today — it's free</p>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Min. 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-10 font-medium" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
