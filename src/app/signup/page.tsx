'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { doc } from 'firebase/firestore';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUpPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, {
          id: user.uid,
          email: user.email,
          name: user.email?.split('@')[0] || 'New User',
          registrationDate: new Date().toISOString(),
        }, {});
        
        toast({
          title: 'Sign-up Successful',
          description: 'Your account has been created successfully.',
          variant: 'default',
        });
        
        form.reset();
      }
    } catch (error) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use. Please try signing in or use a different email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use at least 6 characters.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password authentication is not enabled. Please contact support.';
            break;
          default:
            console.error('Sign-up error:', error);
            break;
        }
      }
      
      toast({
        title: 'Sign-up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
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
                      <Input type="password" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
