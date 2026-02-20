
'use client';

import {
  BookOpen,
  FileText,
  FolderKanban,
  LayoutGrid,
  Bot,
  Sparkles,
  GraduationCap,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

const mainLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/resources', label: 'Resources', icon: FolderKanban },
  { href: '/profile', label: 'My Profile', icon: User },
];

const aiLinks = [
  { href: '/chatbot', label: 'CampusBot', icon: Bot },
  { href: '/study-tools', label: 'AI Study Tools', icon: Sparkles },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-bold font-headline text-sidebar-foreground">Campus Hub</span>
            <p className="text-[10px] text-sidebar-foreground/50 leading-none">Academic Portal</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 uppercase tracking-wider px-2">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {mainLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
                    tooltip={link.label}
                    className={cn(
                      'rounded-lg transition-all duration-200',
                      pathname === link.href
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                  >
                    <link.icon className="h-4.5 w-4.5" />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="mx-2 bg-sidebar-border/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 uppercase tracking-wider px-2">AI Features</SidebarGroupLabel>
          <SidebarMenu>
            {aiLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
                    tooltip={link.label}
                    className={cn(
                      'rounded-lg transition-all duration-200',
                      pathname === link.href
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                  >
                    <link.icon className="h-4.5 w-4.5" />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-sidebar-foreground">AI Study Tools Active</span>
          </div>
          <p className="text-[10px] text-sidebar-foreground/60 leading-relaxed">
            Get personalized study recommendations powered by Gemini AI.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
