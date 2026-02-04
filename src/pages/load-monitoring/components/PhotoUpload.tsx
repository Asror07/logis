import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Camera, FileText, X, Plus, Image as ImageIcon } from 'lucide-react';

interface Photo {
  id: string;
  type: 'unit' | 'paperwork' | 'damage' | 'other';
  dataUrl: string;
  takenAt: string;
}

interface PhotoUploadProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  minPhotos?: number;
  maxPhotos?: number;
  className?: string;
}

const photoTypeConfig = {
  unit: { label: 'Unit', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  paperwork: { label: 'Paperwork', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
  damage: { label: 'Damage', color: 'bg-destructive/20 text-destructive border-destructive/50' },
  other: { label: 'Other', color: 'bg-muted text-muted-foreground border-muted-foreground/50' },
};

export function PhotoUpload({
  photos,
  onPhotosChange,
  minPhotos = 2,
  maxPhotos = 10,
  className,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingType, setPendingType] = useState<Photo['type']>('unit');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (photos.length >= maxPhotos) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: pendingType,
          dataUrl: reader.result as string,
          takenAt: new Date().toISOString(),
        };
        onPhotosChange([...photos, newPhoto]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  };

  const handleAddPhoto = (type: Photo['type']) => {
    setPendingType(type);
    fileInputRef.current?.click();
  };

  const hasUnitPhoto = photos.some(p => p.type === 'unit');
  const hasPaperworkPhoto = photos.some(p => p.type === 'paperwork');
  const isValid = hasUnitPhoto && hasPaperworkPhoto && photos.length >= minPhotos;

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Quick Add Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={hasUnitPhoto ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => handleAddPhoto('unit')}
          disabled={photos.length >= maxPhotos}
          className={cn(hasUnitPhoto && 'border-green-500/50')}
        >
          <Camera className="h-4 w-4 mr-1" />
          {hasUnitPhoto ? '✓ Unit Photo' : '+ Unit Photo'}
        </Button>
        <Button
          type="button"
          variant={hasPaperworkPhoto ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => handleAddPhoto('paperwork')}
          disabled={photos.length >= maxPhotos}
          className={cn(hasPaperworkPhoto && 'border-green-500/50')}
        >
          <FileText className="h-4 w-4 mr-1" />
          {hasPaperworkPhoto ? '✓ Paperwork' : '+ Paperwork'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddPhoto('damage')}
          disabled={photos.length >= maxPhotos}
        >
          <Plus className="h-4 w-4 mr-1" />
          Damage
        </Button>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => {
            const config = photoTypeConfig[photo.type];
            return (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                <img
                  src={photo.dataUrl}
                  alt={`${photo.type} photo`}
                  className="w-full h-full object-cover"
                />
                <Badge
                  variant="outline"
                  className={cn('absolute bottom-1 left-1 text-[10px] px-1.5 py-0', config.color)}
                >
                  {config.label}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            Add at least 1 unit photo and 1 paperwork photo
          </p>
        </div>
      )}

      {/* Validation Status */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          'text-muted-foreground',
          !isValid && 'text-orange-400'
        )}>
          {photos.length}/{maxPhotos} photos ({minPhotos} min required)
        </span>
        {!isValid && (
          <span className="text-orange-400">
            {!hasUnitPhoto && 'Need unit photo. '}
            {!hasPaperworkPhoto && 'Need paperwork photo.'}
          </span>
        )}
      </div>
    </div>
  );
}
