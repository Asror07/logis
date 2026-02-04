import { useRef, useEffect, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Paperclip, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import type { ChatUser, ChatMessage } from '../types';

interface ChatContentProps {
  user: ChatUser;
  messages: ChatMessage[];
  isAIEnabled: boolean;
  onToggleAI: () => void;
}

export function ChatContent({ user, messages, isAIEnabled, onToggleAI }: ChatContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate AI typing indicator
  useEffect(() => {
    if (isAIEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'user') {
        setIsTyping(true);
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    }
    setIsTyping(false);
  }, [messages, isAIEnabled]);

  // Group messages by date
  const getDateSeparator = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupedMessages = messages.reduce<{ date: string; messages: ChatMessage[] }[]>(
    (acc, message) => {
      const dateStr = getDateSeparator(message.timestamp);
      const lastGroup = acc[acc.length - 1];

      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.messages.push(message);
      } else {
        acc.push({ date: dateStr, messages: [message] });
      }

      return acc;
    },
    []
  );

  const handleSend = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send the message
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <ChatHeader user={user} isAIEnabled={isAIEnabled} onToggleAI={onToggleAI} />

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4 max-w-3xl mx-auto">
          {groupedMessages.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                  {group.date}
                </div>
              </div>

              {/* Messages */}
              {group.messages.map((message) => (
                <MessageBubble key={message.id} message={message} userName={user.name} />
              ))}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>AI is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-3xl mx-auto">
          {/* Quick Actions */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Quick actions:</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Send SMS
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Make Call
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Send Email
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                placeholder={
                  isAIEnabled
                    ? 'AI is handling this conversation. Take over to send messages...'
                    : 'Type a message...'
                }
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAIEnabled}
                className={cn(
                  'min-h-[44px] max-h-32 resize-none pr-12',
                  isAIEnabled && 'opacity-50 cursor-not-allowed'
                )}
                rows={1}
              />
            </div>

            <Button
              size="icon"
              className="h-10 w-10 shrink-0"
              disabled={!messageInput.trim() || isAIEnabled}
              onClick={handleSend}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* AI Status */}
          {isAIEnabled && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>AI is actively managing this conversation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
