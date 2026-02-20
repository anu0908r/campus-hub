'use client';

import { useState } from 'react';
import { resources } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, ExternalLink, Star, Globe, BookMarked,
  Code2, BookOpen, Calculator, FlaskConical, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const typeIconMap: Record<string, React.ReactNode> = {
  Website: <Globe className="w-5 h-5" />,
  Documentation: <Code2 className="w-5 h-5" />,
  Platform: <BookMarked className="w-5 h-5" />,
  eBooks: <BookOpen className="w-5 h-5" />,
  Tool: <Calculator className="w-5 h-5" />,
  'Search Engine': <Search className="w-5 h-5" />,
};

const typeColorMap: Record<string, string> = {
  Website: 'bg-blue-100 text-blue-600',
  Documentation: 'bg-purple-100 text-purple-600',
  Platform: 'bg-emerald-100 text-emerald-600',
  eBooks: 'bg-amber-100 text-amber-600',
  Tool: 'bg-pink-100 text-pink-600',
  'Search Engine': 'bg-cyan-100 text-cyan-600',
};

const types = ['All', ...Array.from(new Set(resources.map(r => r.type)))];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase()) ||
      resource.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'All' || resource.type === activeType;
    return matchesSearch && matchesType;
  });

  const featured = resources.filter(r => r.featured);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Resource Hub</h1>
        <p className="text-muted-foreground text-lg">A centralized collection of useful study materials and links.</p>
      </div>

      {/* Featured Resources */}
      {activeType === 'All' && !search && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-500" />
            <h2 className="font-headline text-lg font-semibold">Featured Resources</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map((resource, i) => (
              <Card key={i} className="card-hover border-amber-200/60 bg-gradient-to-br from-amber-50/60 to-orange-50/40 overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${typeColorMap[resource.type] || 'bg-gray-100 text-gray-600'} flex-shrink-0`}>
                      {typeIconMap[resource.type] || <Globe className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-headline font-semibold text-base">{resource.title}</h3>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{resource.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">{resource.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full mt-4">
                    <Link href={resource.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      Open Resource
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources or categories..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <Button
              key={type}
              variant={activeType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveType(type)}
              className="rounded-full text-xs h-8"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 -mt-4">
        <Badge variant="secondary" className="text-xs">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Resource Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((resource, i) => (
            <Card key={i} className="card-hover border-border/60 group flex flex-col">
              <CardContent className="p-5 flex flex-col gap-3 flex-grow">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${typeColorMap[resource.type] || 'bg-gray-100 text-gray-600'} flex-shrink-0`}>
                    {typeIconMap[resource.type] || <Globe className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-semibold text-sm leading-snug">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{resource.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">{resource.category}</Badge>
                  {resource.featured && (
                    <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                      <Star className="w-2.5 h-2.5 mr-1 fill-amber-500 text-amber-500" />Featured
                    </Badge>
                  )}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                  <Link href={resource.href} target="_blank" rel="noopener noreferrer">
                    Open <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="bg-muted p-4 rounded-full">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-headline text-lg font-semibold">No resources found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setActiveType('All'); }}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
