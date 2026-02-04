import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  User,
  Truck,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exception } from '../types';
import { typeIcons, statusColors, actionDetails } from '../data';

interface ExceptionDetailProps {
  exception: Exception | null;
}

export function ExceptionDetail({ exception }: ExceptionDetailProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  if (!exception) {
    return (
      <Card variant="glow">
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select an exception to view details and take action</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = typeIcons[exception.type];

  return (
    <Card variant="glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              exception.severity === 'critical' && "bg-destructive/20 text-destructive",
              exception.severity === 'warning' && "bg-warning/20 text-warning",
              exception.severity === 'info' && "bg-info/20 text-info"
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {exception.loadId}
                <Badge className={statusColors[exception.status]}>
                  {exception.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{exception.type} Exception</p>
            </div>
          </div>
          {exception.status !== 'resolved' && (
            <Button variant="default">
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolve
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exception Details */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-sm">{exception.message}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <User className="h-3 w-3" />
              Driver
            </div>
            <p className="font-medium">{exception.driver}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Truck className="h-3 w-3" />
              Carrier
            </div>
            <p className="font-medium">{exception.carrier}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              Location
            </div>
            <p className="font-medium">{exception.location}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              ETA Impact
            </div>
            <p className="font-medium text-primary">{exception.affectedEta}</p>
          </div>
        </div>

        {/* AI Suggested Actions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI-Suggested Resolutions
          </h3>
          <div className="space-y-2">
            {exception.suggestedActions.map((action, index) => {
              const details = actionDetails[action];
              const isExpanded = expandedAction === action;
              return (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => setExpandedAction(isExpanded ? null : action)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between group",
                      isExpanded
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/30 hover:bg-primary/10 hover:border-primary/50"
                    )}
                  >
                    <span className="text-sm font-medium">{action}</span>
                    <ArrowRight className={cn(
                      "h-4 w-4 transition-all",
                      isExpanded ? "rotate-90 text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                  </button>
                  {isExpanded && details && (
                    <div className="ml-4 p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3 animate-fade-in">
                      <p className="text-sm text-muted-foreground">{details.description}</p>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Steps:</p>
                        <ol className="space-y-1.5">
                          {details.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm flex items-start gap-2">
                              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Est. time: {details.estimatedTime}
                        </span>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Call Driver
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              Send Update
            </Button>
            <Button variant="outline" className="flex-1">
              <Brain className="h-4 w-4 mr-1" />
              Rerun AI
            </Button>
          </div>
        </div>

        {/* Assignment */}
        {exception.assignedTo && (
          <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{exception.assignedTo}</p>
                <p className="text-xs text-muted-foreground">Assigned handler</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Reassign</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
