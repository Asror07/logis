import {
  MessageSquare,
  Mail,
  Bot,
  User,
  Bell,
  Link2
} from "lucide-react";

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'sms': return <MessageSquare className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'ai_call': return <Bot className="h-4 w-4" />;
    case 'human_call': return <User className="h-4 w-4" />;
    case 'push': return <Bell className="h-4 w-4" />;
    case 'webhook': return <Link2 className="h-4 w-4" />;
    default: return <MessageSquare className="h-4 w-4" />;
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'sms': return 'SMS';
    case 'email': return 'Email';
    case 'ai_call': return 'AI Call';
    case 'human_call': return 'Dispatcher Call';
    case 'push': return 'Push';
    case 'webhook': return 'Webhook';
    default: return type;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': case 'answered': return 'bg-success';
    case 'sent': case 'queued': return 'bg-primary';
    case 'opened': case 'clicked': case 'responded': return 'bg-accent';
    case 'failed': case 'bounced': case 'busy': return 'bg-destructive';
    case 'no_answer': return 'bg-warning';
    default: return 'bg-muted';
  }
};

export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'delivered': case 'answered': case 'responded': return 'default';
    case 'failed': case 'bounced': return 'destructive';
    default: return 'secondary';
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'text-success';
    case 'negative': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};
