import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Filter,
  MessageSquare,
  Mail,
  Bot,
  User,
  Bell,
  Link2,
  Clock,
  Zap,
  CheckCircle2,
  Eye,
  MousePointer,
  MessageCircle,
  XCircle,
  AlertCircle,
  Phone,
  PhoneMissed,
  PhoneOff,
  Volume2,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { ExpandedFilters } from "../types";

interface InteractionLogsFiltersProps {
  expandedFilters: ExpandedFilters;
  toggleFilter: (category: keyof ExpandedFilters) => void;
}

interface FilterSectionProps {
  title: string;
  category: keyof ExpandedFilters;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        {title}
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FilterItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  checked?: boolean;
  onChange?: () => void;
}

function FilterItem({ icon, label, count, checked, onChange }: FilterItemProps) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors text-muted-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {icon}
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </label>
  );
}

export function InteractionLogsFilters({
  expandedFilters,
  toggleFilter
}: InteractionLogsFiltersProps) {
  return (
    <div className="border-r border-border bg-card overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </h3>
          <Button variant="ghost" size="sm" className="text-xs">Clear All</Button>
        </div>

        <div className="space-y-1">
          <FilterSection
            title="Communication Type"
            category="type"
            expanded={expandedFilters.type}
            onToggle={() => toggleFilter('type')}
          >
            <FilterItem icon={<MessageSquare className="h-4 w-4" />} label="SMS/Text" count={892} />
            <FilterItem icon={<Mail className="h-4 w-4" />} label="Email" count={245} />
            <FilterItem icon={<Bot className="h-4 w-4" />} label="AI Voice Call" count={67} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Dispatcher Call" count={31} />
            <FilterItem icon={<Bell className="h-4 w-4" />} label="Push Notification" count={12} />
            <FilterItem icon={<Link2 className="h-4 w-4" />} label="Webhook/API" count={43} />
          </FilterSection>

          <Separator />

          <FilterSection
            title="Status"
            category="status"
            expanded={expandedFilters.status}
            onToggle={() => toggleFilter('status')}
          >
            <FilterItem icon={<Clock className="h-4 w-4" />} label="Queued" count={23} />
            <FilterItem icon={<Zap className="h-4 w-4" />} label="Sent" count={1089} />
            <FilterItem icon={<CheckCircle2 className="h-4 w-4 text-success" />} label="Delivered" count={1045} />
            <FilterItem icon={<Eye className="h-4 w-4 text-accent" />} label="Opened/Read" count={678} />
            <FilterItem icon={<MousePointer className="h-4 w-4" />} label="Clicked" count={234} />
            <FilterItem icon={<MessageCircle className="h-4 w-4 text-accent" />} label="Responded" count={156} />
            <FilterItem icon={<XCircle className="h-4 w-4 text-destructive" />} label="Failed" count={12} />
            <FilterItem icon={<AlertCircle className="h-4 w-4 text-destructive" />} label="Bounced" count={8} />
            <FilterItem icon={<Phone className="h-4 w-4 text-success" />} label="Call Answered" count={72} />
            <FilterItem icon={<PhoneMissed className="h-4 w-4 text-warning" />} label="No Answer" count={18} />
            <FilterItem icon={<PhoneOff className="h-4 w-4 text-destructive" />} label="Call Failed" count={4} />
          </FilterSection>

          <Separator />

          <FilterSection
            title="Event Type"
            category="event"
            expanded={expandedFilters.event}
            onToggle={() => toggleFilter('event')}
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">Load Lifecycle</div>
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-primary" />} label="Load Assigned" count={89} />
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-primary" />} label="Pickup Complete" count={143} />
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-primary" />} label="In Transit Update" count={445} />
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-primary" />} label="Delivery Complete" count={134} />
            <div className="text-xs font-medium text-muted-foreground mb-2 mt-3">Exceptions</div>
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-warning" />} label="Delay Notification" count={67} />
            <FilterItem icon={<div className="w-2 h-2 rounded-full bg-destructive" />} label="Off-Route Alert" count={23} />
          </FilterSection>

          <Separator />

          <FilterSection
            title="Recipient"
            category="recipient"
            expanded={expandedFilters.recipient}
            onToggle={() => toggleFilter('recipient')}
          >
            <FilterItem icon={<User className="h-4 w-4" />} label="Shipper" count={312} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Broker" count={245} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Carrier" count={189} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Driver" count={423} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Customer" count={78} />
          </FilterSection>

          <Separator />

          <FilterSection
            title="Additional"
            category="additional"
            expanded={expandedFilters.additional}
            onToggle={() => toggleFilter('additional')}
          >
            <FilterItem icon={<Bot className="h-4 w-4" />} label="AI Generated" count={987} />
            <FilterItem icon={<User className="h-4 w-4" />} label="Manual" count={260} />
            <FilterItem icon={<Volume2 className="h-4 w-4" />} label="Has Recording" count={98} />
          </FilterSection>
        </div>
      </div>
    </div>
  );
}
