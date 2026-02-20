import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Clock, User, BookOpen, CheckCircle2 } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  description: string;
  image: {
    id: string;
    hint: string;
  };
  instructor?: string;
  category?: string;
  progress?: number;
  credits?: number;
  schedule?: string;
  status?: string;
};

interface CourseCardProps {
  course: Course;
}

function getStatusColor(status?: string) {
  switch (status) {
    case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Not Started': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getCategoryColor(category?: string) {
  switch (category) {
    case 'Computer Science': return 'bg-violet-100 text-violet-700';
    case 'Arts & Humanities': return 'bg-pink-100 text-pink-700';
    case 'Natural Sciences': return 'bg-teal-100 text-teal-700';
    case 'History': return 'bg-amber-100 text-amber-700';
    case 'Mathematics': return 'bg-cyan-100 text-cyan-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === course.image.id);
  const progress = course.progress ?? 0;

  return (
    <Card className="flex flex-col overflow-hidden card-hover border-border/60 group">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {placeholder && (
          <Image
            src={placeholder.imageUrl}
            alt={placeholder.description}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={placeholder.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(course.category)}`}>
            {course.category || 'General'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {course.status === 'Completed' ? (
            <div className="bg-emerald-500 p-1 rounded-full shadow">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </div>
          ) : null}
        </div>
        {course.credits && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {course.credits} credits
          </div>
        )}
      </div>
      <CardContent className="p-5 flex flex-col flex-grow gap-3">
        <div>
          <h3 className="font-headline font-semibold text-base leading-tight mb-1 line-clamp-2">{course.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          {course.instructor && (
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{course.instructor}</span>
            </div>
          )}
          {course.schedule && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{course.schedule}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(course.status)}`}>
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <Button className="w-full mt-1" size="sm" asChild>
          <Link href="#">
            <BookOpen className="h-3.5 w-3.5 mr-2" />
            Go to Course
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
