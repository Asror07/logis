import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Calendar,
  Search,
  Download,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { InteractionStats } from "../types";

interface InteractionLogsHeaderProps {
  stats: InteractionStats;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function InteractionLogsHeader({
  stats,
  searchQuery,
  setSearchQuery
}: InteractionLogsHeaderProps) {
  return (
    <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Interaction Logs & Call History</h1>
          </div>

          <div className="flex items-center gap-4 ml-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <span className="font-medium">{stats.total.toLocaleString()}</span>
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{stats.sms}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{stats.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{stats.calls}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span>{stats.push}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Days
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
