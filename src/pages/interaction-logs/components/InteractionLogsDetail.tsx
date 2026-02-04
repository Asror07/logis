import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  RefreshCw,
  Copy,
  Download,
  Play,
  Pause,
  CheckCircle2,
  Tag,
  StickyNote,
  ChevronDown
} from "lucide-react";
import { Interaction } from "../types";
import { getTypeIcon, getTypeLabel, getStatusBadgeVariant, getSentimentColor } from "../utils";

interface InteractionLogsDetailProps {
  selectedInteraction: Interaction | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackProgress: number;
  setPlaybackProgress: (progress: number) => void;
  newNote: string;
  setNewNote: (note: string) => void;
}

export function InteractionLogsDetail({
  selectedInteraction,
  isPlaying,
  setIsPlaying,
  playbackProgress,
  setPlaybackProgress,
  newNote,
  setNewNote
}: InteractionLogsDetailProps) {
  if (!selectedInteraction) {
    return (
      <div className="border-l border-border bg-card flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select an interaction to view details</p>
      </div>
    );
  }

  return (
    <div className="border-l border-border bg-card overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant={getStatusBadgeVariant(selectedInteraction.status)} className="capitalize">
              {selectedInteraction.status.replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              {getTypeIcon(selectedInteraction.type)}
            </div>
            <div>
              <p className="font-medium">{getTypeLabel(selectedInteraction.type)}</p>
              <p className="text-xs text-muted-foreground">{selectedInteraction.timestamp}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Load & Recipient Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Load & Recipient</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Load ID</p>
              <p className="font-mono text-primary">{selectedInteraction.loadId}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cost</p>
              <p>{selectedInteraction.cost}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Recipient</p>
              <p className="font-medium">{selectedInteraction.recipient.name}</p>
              <p className="text-xs text-muted-foreground">{selectedInteraction.recipient.contact}</p>
              {selectedInteraction.recipient.company && (
                <p className="text-xs text-muted-foreground">{selectedInteraction.recipient.company}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Message Content */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Content</h4>
          <div className="p-3 bg-secondary/50 rounded-lg text-sm">
            {selectedInteraction.fullContent}
          </div>
        </div>

        {/* Call Details */}
        {selectedInteraction.callDetails && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Call Details</h4>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p>{selectedInteraction.callDetails.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Outcome</p>
                  <p>{selectedInteraction.callDetails.outcome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Sentiment</p>
                  <p className={`capitalize ${getSentimentColor(selectedInteraction.callDetails.sentiment)}`}>
                    {selectedInteraction.callDetails.sentiment} ({(selectedInteraction.callDetails.sentimentScore * 100).toFixed(0)}%)
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              {selectedInteraction.callDetails.recordingUrl && (
                <Card className="bg-secondary/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={[playbackProgress]}
                          max={100}
                          step={1}
                          onValueChange={(v) => setPlaybackProgress(v[0])}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">1:34</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transcript */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Transcript</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedInteraction.callDetails.transcript.map((line, i) => (
                    <div key={i} className="text-xs">
                      <span className="text-muted-foreground">[{line.time}]</span>
                      <span className={`ml-2 font-medium ${line.speaker === 'AI Agent' ? 'text-primary' : line.speaker === 'System' ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {line.speaker}:
                      </span>
                      <span className="ml-1">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics & Action Items */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Topics Discussed</p>
                <div className="flex flex-wrap gap-1">
                  {selectedInteraction.callDetails.topics.map((topic, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Action Items</p>
                <ul className="text-xs space-y-1">
                  {selectedInteraction.callDetails.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* AI Details */}
        {selectedInteraction.aiDetails && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">AI Generation</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p>{selectedInteraction.aiDetails.model}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Template</p>
                  <p>{selectedInteraction.aiDetails.template}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Significance</p>
                  <p>{(selectedInteraction.aiDetails.significanceScore * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p>{(selectedInteraction.aiDetails.confidenceScore * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tokens Used</p>
                  <p>{selectedInteraction.aiDetails.tokensUsed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gen Time</p>
                  <p>{selectedInteraction.aiDetails.generationTime}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <Button variant="ghost" size="sm" className="text-xs">+ Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedInteraction.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {selectedInteraction.tags.length === 0 && (
              <span className="text-xs text-muted-foreground">No tags</span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Internal Notes
          </h4>
          {selectedInteraction.notes.length > 0 && (
            <div className="space-y-2">
              {selectedInteraction.notes.map((note, i) => (
                <div key={i} className="p-2 bg-secondary/50 rounded text-xs">{note}</div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="text-xs min-h-[60px]"
            />
          </div>
          <Button size="sm" className="w-full">Add Note</Button>
        </div>

        {/* Related */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {selectedInteraction.relatedInteractions} related interactions for this load
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View All Related
          </Button>
        </div>

        {/* Metadata */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground">
            System Metadata
            <ChevronDown className="h-3 w-3" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-1 text-xs text-muted-foreground">
            <p>ID: {selectedInteraction.id}</p>
            <p>Cost: {selectedInteraction.cost}</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
