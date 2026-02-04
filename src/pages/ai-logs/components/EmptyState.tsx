import { MessageSquare, Bot } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">AI Conversations</h2>
        <p className="text-muted-foreground mb-4">
          Select a user from the sidebar to view their conversation history with AI and take control when needed.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>SMS</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📧</span>
            <span>Email</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📞</span>
            <span>Calls</span>
          </div>
        </div>
      </div>
    </div>
  );
}
