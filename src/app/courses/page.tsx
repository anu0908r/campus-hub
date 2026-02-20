'use client';

import { useState } from 'react';
import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, GraduationCap, TrendingUp, CheckCircle2, Clock4 } from 'lucide-react';

const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

const stats = [
  { label: 'Total Enrolled', value: courses.length, icon: GraduationCap, color: 'text-blue-600 bg-blue-100' },
  { label: 'In Progress', value: courses.filter(c => c.status === 'In Progress').length, icon: TrendingUp, color: 'text-amber-600 bg-amber-100' },
  { label: 'Completed', value: courses.filter(c => c.status === 'Completed').length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Not Started', value: courses.filter(c => c.status === 'Not Started').length, icon: Clock4, color: 'text-gray-600 bg-gray-100' },
];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      (course.instructor || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">My Courses</h1>
        <p className="text-muted-foreground text-lg">Browse and access your enrolled courses.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center gap-3 bg-card rounded-xl border border-border/60 p-4 card-hover">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-headline text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses or instructors..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat as string)}
              className="rounded-full text-xs h-8"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
        </Badge>
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-muted-foreground hover:text-foreground underline">
            Clear search
          </button>
        )}
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="bg-muted p-4 rounded-full">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-headline text-lg font-semibold">No courses found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
