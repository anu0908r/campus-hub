'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { notes } from "@/lib/mock-data";
import {
  Download, FileText, MoreHorizontal, UploadCloud, Search,
  FileType, File, Clock, BookOpen, Tag, Trash2, Pencil
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FileTypeIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  switch (type?.toUpperCase()) {
    case 'PDF': return <FileText className={`${cls} text-red-500`} />;
    case 'DOCX': return <FileType className={`${cls} text-blue-500`} />;
    default: return <File className={`${cls} text-gray-400`} />;
  }
}

function FileTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700 border-red-200',
    DOCX: 'bg-blue-100 text-blue-700 border-blue-200',
    TXT: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colors[type] || colors.TXT}`}>
      {type}
    </span>
  );
}

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const courses = Array.from(new Set(notes.map(n => n.course)));

  const filtered = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.course.toLowerCase().includes(search.toLowerCase()) ||
      (note.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCourse = courseFilter === 'all' || note.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Notes Repository</h1>
        <p className="text-muted-foreground text-lg">Upload, manage, and access your study notes.</p>
      </div>

      {/* Upload Card */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg">Upload New Note</CardTitle>
          <CardDescription>Drag and drop your files here or click to browse.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-foreground font-medium">
                  <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT – up to 50MB</p>
                <Button size="sm" variant="outline" className="mt-1">Browse files</Button>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes, courses, or tags..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(course => (
              <SelectItem key={course} value={course}>{course}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="self-center text-xs whitespace-nowrap">
          {filtered.length} note{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Notes Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <Card key={note.id} className="card-hover border-border/60 group flex flex-col">
              <CardContent className="p-5 flex flex-col gap-3 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="bg-muted p-2.5 rounded-lg mt-0.5">
                    <FileTypeIcon type={note.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 leading-snug">{note.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{note.course}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                        <span className="sr-only">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem><Download className="h-3.5 w-3.5 mr-2" />Download</DropdownMenuItem>
                      <DropdownMenuItem><Pencil className="h-3.5 w-3.5 mr-2" />Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">
                        <Tag className="h-2.5 w-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{note.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileTypeBadge type={note.type} />
                    <span>{note.size}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full text-xs mt-1">
                  <Download className="h-3.5 w-3.5 mr-1.5" />Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="bg-muted p-4 rounded-full">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-headline text-lg font-semibold">No notes found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or upload a new note.</p>
        </div>
      )}
    </div>
  );
}
