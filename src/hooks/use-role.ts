'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

export type UserRole = 'admin' | 'teacher' | 'student';

export function useRole() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data, isLoading: isDocLoading, error } = useDoc<{ role?: UserRole }>(userDocRef);

  const role: UserRole = data?.role || 'student'; // Default to student if not set
  const isLoading = isUserLoading || isDocLoading;

  return { role, isLoading, error };
}
