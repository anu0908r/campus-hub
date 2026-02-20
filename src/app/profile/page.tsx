'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useUser, useAuth } from '@/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Bell,
  Shield,
  LogOut,
  Camera,
  BookOpen,
  GraduationCap,
  Trophy,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || user?.email?.split('@')[0] || '');
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    courseReminders: true,
    aiSuggestions: false,
    weeklyDigest: true,
  });

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast({ title: 'Profile updated', description: 'Your display name has been updated.' });
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    signOut(auth);
    router.push('/login');
  };

  const stats = [
    { label: 'Courses Enrolled', value: '6', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { label: 'Notes Uploaded', value: '5', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Study Streak', value: '7 days', icon: Trophy, color: 'bg-amber-100 text-amber-600' },
    { label: 'Member Since', value: 'Feb 2026', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Overview */}
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                <AvatarImage src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm hover:bg-primary/90 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-headline text-xl font-bold">
                  {user?.displayName || user?.email?.split('@')[0] || 'Student'}
                </h2>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">Student</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Mail className="h-3.5 w-3.5" />
                <span>{user?.email}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Academic Year 2025–26 · Spring Semester</p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit Profile */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4.5 w-4.5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your display name and profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-4.5 w-4.5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control what notifications you receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { key: 'emailUpdates', label: 'Email Updates', desc: 'Important account and course updates' },
              { key: 'courseReminders', label: 'Course Reminders', desc: 'Upcoming assignments and deadlines' },
              { key: 'aiSuggestions', label: 'AI Suggestions', desc: 'Personalized study recommendations' },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your weekly activity' },
            ].map(pref => (
              <div key={pref.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <Switch
                  checked={notifications[pref.key as keyof typeof notifications]}
                  onCheckedChange={val => setNotifications(prev => ({ ...prev, [pref.key]: val }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-4.5 w-4.5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Min. 6 characters" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" className="w-full">Update Password</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <LogOut className="h-4.5 w-4.5" />
              Account Actions
            </CardTitle>
            <CardDescription>Manage your session and account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
              <p className="text-sm font-medium mb-0.5">Sign Out</p>
              <p className="text-xs text-muted-foreground mb-3">You will be signed out of all devices.</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign Out
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-0.5">Delete Account</p>
              <p className="text-xs text-muted-foreground mb-3">Permanently delete your account and all data. This cannot be undone.</p>
              <Button variant="outline" size="sm" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10">
                Request Deletion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
