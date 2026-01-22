import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/mock-data';

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Courses</h1>
        <p className="text-muted-foreground text-lg">Browse and access your enrolled courses.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
