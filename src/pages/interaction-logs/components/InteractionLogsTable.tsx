import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomTable, Column } from "@/components/ui/table/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MousePointer,
  MessageCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  Copy,
  ExternalLink,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Interaction } from "../types";
import { getTypeIcon, getStatusColor } from "../utils";

interface InteractionLogsTableProps {
  interactions: Interaction[];
  selectedInteraction: Interaction | null;
  onSelectInteraction: (interaction: Interaction) => void;
}

export function InteractionLogsTable({
  interactions,
  selectedInteraction,
  onSelectInteraction,
}: InteractionLogsTableProps) {
  const columns: Column<Interaction>[] = [
    {
      key: "status",
      header: "",
      className: "w-8",
      render: (interaction) => (
        <div className={cn("w-2 h-2 rounded-full", getStatusColor(interaction.status))} />
      ),
    },
    {
      key: "type",
      header: "Type",
      className: "w-10",
      render: (interaction) => (
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          {getTypeIcon(interaction.type)}
        </div>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      className: "w-24 text-xs text-muted-foreground",
      render: (interaction) => interaction.timestamp,
    },
    {
      key: "loadId",
      header: "Load ID",
      className: "w-28 text-sm font-mono text-primary",
      render: (interaction) => interaction.loadId,
    },
    {
      key: "recipient",
      header: "Recipient",
      className: "w-44",
      render: (interaction) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium truncate">{interaction.recipient.name}</span>
          <Badge variant="outline" className="text-xs capitalize w-fit">
            {interaction.recipient.role}
          </Badge>
        </div>
      ),
    },
    {
      key: "eventType",
      header: "Event",
      className: "w-32",
      render: (interaction) => (
        <Badge variant="secondary" className="text-xs">
          {interaction.eventType}
        </Badge>
      ),
    },
    {
      key: "preview",
      header: "Preview",
      className: "min-w-[200px]",
      render: (interaction) => (
        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
          {interaction.preview}
        </p>
      ),
    },
    {
      key: "metrics",
      header: "Metrics",
      className: "w-28",
      render: (interaction) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {interaction.metrics.opened !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {interaction.metrics.opened}
            </span>
          )}
          {interaction.metrics.clicked !== undefined && (
            <span className="flex items-center gap-1">
              <MousePointer className="h-3 w-3" />
              {interaction.metrics.clicked}
            </span>
          )}
          {interaction.metrics.replied !== undefined && (
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {interaction.metrics.replied}
            </span>
          )}
          {interaction.metrics.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {interaction.metrics.duration}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-12",
      render: (interaction) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col min-w-0">
      {/* Analytics Bar */}
      <div className="px-4 py-3 bg-secondary/30 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-muted-foreground">Delivery Rate:</span>
              <span className="ml-2 font-medium text-success">98.3%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Engagement:</span>
              <span className="ml-2 font-medium text-primary">67.5%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Response Rate:</span>
              <span className="ml-2 font-medium">12.8%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Call Duration:</span>
              <span className="ml-2 font-medium">2:15</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-success text-xs">+12% from last week</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <CustomTable
          data={interactions}
          columns={columns}
          onRowClick={onSelectInteraction}
          getRowKey={(interaction) => interaction.id}
        />
      </div>
    </div>
  );
}
