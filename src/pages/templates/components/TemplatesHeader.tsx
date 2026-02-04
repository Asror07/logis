import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TemplatesHeader({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="relative flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Message Templates</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage notification templates
        </p>
      </div>
      <Button variant="gradient" onClick={onCreateNew}>
        <Plus className="h-4 w-4 mr-1" />
        New Template
      </Button>
    </div>
  );
}
