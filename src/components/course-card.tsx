import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  description: string;
  image: {
    id: string;
    hint: string;
  };
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === course.image.id);

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/2] w-full">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={placeholder.description}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
        <CardDescription className="flex-grow">{course.description}</CardDescription>
        <Button className="mt-4 w-full" asChild>
            <Link href="#">
                Go to course
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
