import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/lib/mock-data";

export default function ResourcesPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">Resource Hub</h1>
                <p className="text-muted-foreground text-lg">A centralized collection of useful study materials and links.</p>
            </div>
            <div className="flex flex-col gap-4">
                {resources.map((resource, index) => (
                    <ResourceCard key={index} resource={resource} />
                ))}
            </div>
        </div>
    );
}
