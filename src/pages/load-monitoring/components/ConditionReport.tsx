import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ConditionReportData {
  hasOverages: boolean;
  hasShortages: boolean;
  hasDamages: boolean;
  notes: string;
}

interface ConditionReportProps {
  report: ConditionReportData;
  onChange: (report: ConditionReportData) => void;
  className?: string;
}

export function ConditionReport({ report, onChange, className }: ConditionReportProps) {
  const hasIssues = report.hasOverages || report.hasShortages || report.hasDamages;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>OS&D Report</span>
        {hasIssues && (
          <AlertTriangle className="h-4 w-4 text-orange-400" />
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="overages"
            checked={report.hasOverages}
            onCheckedChange={(checked) =>
              onChange({ ...report, hasOverages: checked as boolean })
            }
          />
          <Label htmlFor="overages" className="text-sm cursor-pointer">
            Overages
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="shortages"
            checked={report.hasShortages}
            onCheckedChange={(checked) =>
              onChange({ ...report, hasShortages: checked as boolean })
            }
          />
          <Label htmlFor="shortages" className="text-sm cursor-pointer">
            Shortages
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="damages"
            checked={report.hasDamages}
            onCheckedChange={(checked) =>
              onChange({ ...report, hasDamages: checked as boolean })
            }
          />
          <Label htmlFor="damages" className="text-sm cursor-pointer">
            Damages
          </Label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="condition-notes" className="text-sm">
          Notes {hasIssues && <span className="text-destructive">*</span>}
        </Label>
        <Textarea
          id="condition-notes"
          value={report.notes}
          onChange={(e) => onChange({ ...report, notes: e.target.value })}
          placeholder={
            hasIssues
              ? "Please describe the issues in detail..."
              : "Any additional notes about the condition..."
          }
          rows={3}
          className={cn(
            hasIssues && !report.notes.trim() && 'border-destructive'
          )}
        />
        {hasIssues && !report.notes.trim() && (
          <p className="text-xs text-destructive">
            Notes are required when reporting OS&D issues
          </p>
        )}
      </div>
    </div>
  );
}
