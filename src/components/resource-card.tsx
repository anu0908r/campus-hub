import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

type Resource = {
    title: string;
    description: string;
    type: string;
    href: string;
};

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-md">
                            <LinkIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                        </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={resource.href} target="_blank" rel="noopener noreferrer">
                            <ArrowUpRight className="h-5 w-5" />
                            <span className="sr-only">Open resource</span>
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Badge variant="secondary">{resource.type}</Badge>
            </CardContent>
        </Card>
    )
}
