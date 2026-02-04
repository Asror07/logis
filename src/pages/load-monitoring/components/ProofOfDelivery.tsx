import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Camera, FileCheck, Loader2 } from 'lucide-react';
import { Trip, TripStop, Unit } from '../types';
import { SignaturePad } from './SignaturePad';
import { PhotoUpload } from './PhotoUpload';
import { ConditionReport } from './ConditionReport';

interface Photo {
  id: string;
  type: 'unit' | 'paperwork' | 'damage' | 'other';
  dataUrl: string;
  takenAt: string;
}

interface ConditionReportData {
  hasOverages: boolean;
  hasShortages: boolean;
  hasDamages: boolean;
  notes: string;
}

interface PODData {
  signature: {
    dataUrl: string;
    signedBy: string;
    signedAt: string;
  } | null;
  photos: Photo[];
  conditionReport: ConditionReportData;
  gpsLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  confirmedUnits: string[];
}

interface ProofOfDeliveryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
  stop: TripStop;
  onComplete: (stopOrder: number, podData: PODData) => void;
}

export function ProofOfDelivery({ 
  open, 
  onOpenChange, 
  trip, 
  stop, 
  onComplete 
}: ProofOfDeliveryProps) {
  const [receiverName, setReceiverName] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [conditionReport, setConditionReport] = useState<ConditionReportData>({
    hasOverages: false,
    hasShortages: false,
    hasDamages: false,
    notes: '',
  });
  const [confirmedUnits, setConfirmedUnits] = useState<string[]>([]);
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get units for this stop
  const stopUnits = trip.units.filter(u => stop.units.includes(u.id));

  // Capture GPS on open
  useEffect(() => {
    if (open && 'geolocation' in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setGpsLoading(false);
        },
        (error) => {
          console.error('GPS error:', error);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsLoading(false);
    }
  }, [open]);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setReceiverName('');
      setSignature(null);
      setPhotos([]);
      setConditionReport({
        hasOverages: false,
        hasShortages: false,
        hasDamages: false,
        notes: '',
      });
      setConfirmedUnits([]);
    }
  }, [open]);

  const handleUnitToggle = (unitId: string) => {
    setConfirmedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAllUnits = () => {
    if (confirmedUnits.length === stopUnits.length) {
      setConfirmedUnits([]);
    } else {
      setConfirmedUnits(stopUnits.map(u => u.id));
    }
  };

  // Validation
  const hasUnitPhoto = photos.some(p => p.type === 'unit');
  const hasPaperworkPhoto = photos.some(p => p.type === 'paperwork');
  const hasIssues = conditionReport.hasOverages || conditionReport.hasShortages || conditionReport.hasDamages;
  const issuesNeedNotes = hasIssues && !conditionReport.notes.trim();

  const isValid = 
    confirmedUnits.length === stopUnits.length &&
    hasUnitPhoto &&
    hasPaperworkPhoto &&
    signature &&
    receiverName.trim().length >= 2 &&
    !issuesNeedNotes;

  const handleSubmit = async () => {
    if (!isValid || !signature) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const podData: PODData = {
      signature: {
        dataUrl: signature,
        signedBy: receiverName.trim(),
        signedAt: new Date().toISOString(),
      },
      photos,
      conditionReport,
      gpsLocation,
      confirmedUnits,
    };

    onComplete(stop.order, podData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-left">
            Complete Delivery - Stop #{stop.order}
          </SheetTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{stop.location.name}</span>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Units to Deliver */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Units to Deliver ({confirmedUnits.length}/{stopUnits.length})
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllUnits}
                  className="text-xs h-7"
                >
                  {confirmedUnits.length === stopUnits.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="space-y-2">
                {stopUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                      confirmedUnits.includes(unit.id)
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/50 border-border hover:border-muted-foreground/30"
                    )}
                    onClick={() => handleUnitToggle(unit.id)}
                  >
                    <Checkbox
                      checked={confirmedUnits.includes(unit.id)}
                      onCheckedChange={() => handleUnitToggle(unit.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {unit.year} {unit.make} {unit.model}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {unit.id}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {unit.color}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Photos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">Photos</Label>
              </div>
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                minPhotos={2}
                maxPhotos={10}
              />
            </div>

            <Separator />

            {/* Signature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">Receiver Signature</Label>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="receiverName" className="text-xs text-muted-foreground">
                    Receiver's Name *
                  </Label>
                  <Input
                    id="receiverName"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Enter receiver's name"
                  />
                </div>
                <SignaturePad
                  onSave={setSignature}
                  onClear={() => setSignature(null)}
                />
                {signature && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Signature captured
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Condition Report */}
            <ConditionReport
              report={conditionReport}
              onChange={setConditionReport}
            />

            <Separator />

            {/* GPS & Time */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </span>
                {gpsLoading ? (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Getting location...
                  </span>
                ) : gpsLocation ? (
                  <span className="font-mono text-xs">
                    {gpsLocation.latitude.toFixed(4)}°N, {Math.abs(gpsLocation.longitude).toFixed(4)}°W
                  </span>
                ) : (
                  <span className="text-orange-400">Location unavailable</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time
                </span>
                <span className="font-mono text-xs">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          {!isValid && (
            <div className="text-xs text-orange-400 space-y-1">
              {confirmedUnits.length !== stopUnits.length && (
                <p>• Confirm all units</p>
              )}
              {!hasUnitPhoto && <p>• Add unit photo</p>}
              {!hasPaperworkPhoto && <p>• Add paperwork photo</p>}
              {!signature && <p>• Capture signature</p>}
              {receiverName.trim().length < 2 && <p>• Enter receiver name</p>}
              {issuesNeedNotes && <p>• Add notes for OS&D issues</p>}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Delivery'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
