import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '../types';
import { typeColors, channelIcons, typeFilterOptions } from '../data';

interface TemplateLibraryProps {
  templates: Template[];
  selectedTemplate: Template | null;
  searchQuery: string;
  typeFilter: string;
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: string) => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateLibrary({
  templates,
  selectedTemplate,
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
  onSelectTemplate
}: TemplateLibraryProps) {
  return (
    <Card variant="glow" className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Template Library</CardTitle>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {typeFilterOptions.map((type) => (
            <button
              key={type}
              onClick={() => onTypeFilterChange(type)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all capitalize",
                typeFilter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[600px] overflow-y-auto">
        {templates.map((template, index) => {
          const ChannelIcon = channelIcons[template.channel];
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={cn(
                "w-full p-4 border-b border-border/50 text-left hover:bg-secondary/30 transition-all animate-fade-in",
                selectedTemplate?.id === template.id && "bg-primary/10 border-l-4 border-l-primary"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{template.name}</span>
                </div>
                {template.isSystem && (
                  <Badge variant="secondary">System</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", typeColors[template.type])}>
                  {template.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{template.usageCount.toLocaleString()} uses</span>
                <span>{template.lastUsed}</span>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}