import { useState } from 'react';
import {
  Bot,
  User,
  Phone,
  PhoneIncoming,
  Mail,
  MessageSquare,
  Mic,
  Check,
  CheckCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  userName?: string;
}

export function MessageBubble({ message, userName = 'User' }: MessageBubbleProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEmailExpanded, setIsEmailExpanded] = useState(false);

  const isAI = message.sender === 'ai';
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const isHuman = message.sender === 'human';

  // System messages
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted/50 text-muted-foreground text-xs px-4 py-2 rounded-full italic flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          {message.content}
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
    }
  };

  const getTypeIcon = () => {
    switch (message.type) {
      case 'sms':
        return <MessageSquare className="h-3 w-3" />;
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'ai_call':
        return <Phone className="h-3 w-3" />;
      case 'human_call':
        return <PhoneIncoming className="h-3 w-3" />;
      case 'audio':
        return <Mic className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  // Call messages (AI or Human)
  if (message.type === 'ai_call' || message.type === 'human_call') {
    return (
      <div className={cn('flex gap-3 my-3', isAI ? 'justify-start' : 'justify-start')}>
        {/* Avatar */}
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            className={cn(
              'text-xs',
              isAI ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
            )}
          >
            {isAI ? <Bot className="h-4 w-4" /> : 'OP'}
          </AvatarFallback>
        </Avatar>

        {/* Call Card */}
        <Card className="max-w-md bg-card border-border">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  'p-1.5 rounded-full',
                  isAI ? 'bg-primary/10' : 'bg-accent/10'
                )}
              >
                {isAI ? (
                  <Phone className="h-4 w-4 text-primary" />
                ) : (
                  <PhoneIncoming className="h-4 w-4 text-accent" />
                )}
              </div>
              <div>
                <span className="font-medium text-sm">
                  {isAI ? 'AI Voice Call' : 'Operator Call'}
                </span>
                {message.callDetails && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {message.callDetails.duration}
                  </span>
                )}
              </div>
              {message.status === 'failed' && (
                <Badge variant="destructive" className="text-[10px]">
                  Failed
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2">{message.content}</p>

            {/* Audio Player (mock) */}
            {message.callDetails?.recordingUrl && (
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-primary rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.callDetails.duration}
                </span>
              </div>
            )}

            {/* Transcript */}
            {message.callDetails?.transcript && message.callDetails.transcript.length > 0 && (
              <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
                    <span>View Transcript</span>
                    {isTranscriptOpen ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {message.callDetails.transcript.map((entry, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="text-muted-foreground">[{entry.time}]</span>{' '}
                        <span className="font-medium text-primary">{entry.speaker}:</span>{' '}
                        <span>{entry.text}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* AI Details */}
            {message.aiDetails && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>{message.aiDetails.model}</span>
                <span>•</span>
                <span>{(message.aiDetails.confidenceScore * 100).toFixed(0)}% confidence</span>
                <span>•</span>
                <span>{message.aiDetails.tokensUsed} tokens</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="px-3 pb-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {getTypeIcon()}
            <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
            {getStatusIcon()}
          </div>
        </Card>
      </div>
    );
  }

  // Email messages
  if (message.type === 'email') {
    return (
      <div className={cn('flex gap-3 my-3', isAI ? 'justify-start' : 'justify-end')}>
        {isAI && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        <Card className={cn('max-w-md', isAI ? 'bg-card' : 'bg-secondary/50')}>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm truncate">{message.subject || 'Email'}</span>
            </div>

            <Collapsible open={isEmailExpanded} onOpenChange={setIsEmailExpanded}>
              <div className="text-sm whitespace-pre-line">
                {isEmailExpanded
                  ? message.content
                  : message.content.slice(0, 150) + (message.content.length > 150 ? '...' : '')}
              </div>
              {message.content.length > 150 && (
                <CollapsibleTrigger asChild>
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                    {isEmailExpanded ? 'Show less' : 'Read more'}
                  </Button>
                </CollapsibleTrigger>
              )}
            </Collapsible>

            {/* AI Details */}
            {message.aiDetails && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>{message.aiDetails.model}</span>
                <span>•</span>
                <span>{(message.aiDetails.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>

          <div className="px-3 pb-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {getTypeIcon()}
            <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
            {getStatusIcon()}
          </div>
        </Card>

        {isUser && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }

  // Audio messages
  if (message.type === 'audio') {
    return (
      <div className={cn('flex gap-3 my-3', isUser ? 'justify-end' : 'justify-start')}>
        {!isUser && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            'max-w-xs rounded-2xl px-4 py-2',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                isUser ? 'hover:bg-primary-foreground/20' : 'hover:bg-muted'
              )}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-0 bg-current rounded-full" />
              </div>
            </div>
            <Mic className="h-4 w-4" />
          </div>
          <p className="text-xs mt-1 opacity-80">{message.content}</p>

          <div className="flex items-center gap-1.5 mt-1 text-[10px] opacity-70">
            <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
            {isUser && getStatusIcon()}
          </div>
        </div>

        {isUser && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }

  // Standard text/SMS messages
  return (
    <div className={cn('flex gap-3 my-3', isUser || isHuman ? 'justify-end' : 'justify-start')}>
      {(isAI || (!isUser && !isHuman)) && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="max-w-md">
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5',
            isUser || isHuman
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-secondary text-secondary-foreground rounded-bl-md'
          )}
        >
          <p className="text-sm whitespace-pre-line">{message.content}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-2 text-xs rounded-lg px-2 py-1',
                    isUser || isHuman ? 'bg-primary-foreground/20' : 'bg-muted'
                  )}
                >
                  {attachment.type === 'image' ? '📷' : '📎'}
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div
          className={cn(
            'flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground',
            isUser || isHuman ? 'justify-end' : 'justify-start'
          )}
        >
          {getTypeIcon()}
          <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
          {(isUser || isHuman) && getStatusIcon()}
          {message.aiDetails && (
            <>
              <span>•</span>
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{(message.aiDetails.confidenceScore * 100).toFixed(0)}%</span>
            </>
          )}
        </div>
      </div>

      {(isUser || isHuman) && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            className={cn(
              'text-xs',
              isHuman ? 'bg-accent/20 text-accent' : 'bg-secondary text-secondary-foreground'
            )}
          >
            {isHuman ? 'OP' : <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
