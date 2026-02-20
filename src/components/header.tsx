import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { Badge } from './ui/badge';
import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-sm sm:px-6 shadow-sm">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex items-center gap-3 flex-1">
        <div className="flex md:hidden items-center gap-2">
          <div className="bg-primary p-1 rounded-md">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-sm">Campus Hub</span>
        </div>
        <Badge variant="secondary" className="hidden sm:flex text-xs font-normal text-muted-foreground gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Spring 2026
        </Badge>
      </div>
      <UserNav />
    </header>
  );
}
