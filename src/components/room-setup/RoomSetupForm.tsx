import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoomStore, Unit, RoomDimensions } from '@/store/roomStore';
import { ArrowLeft, ArrowRight, Box, Ruler } from 'lucide-react';
import { toast } from 'sonner';

interface RoomSetupFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const RoomSetupForm = ({ onBack, onComplete }: RoomSetupFormProps) => {
  const setDimensions = useRoomStore((state) => state.setDimensions);
  
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<Unit>('meters');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    const heightNum = parseFloat(height);
    
    const minValue = unit === 'meters' ? 1 : 3;
    const maxValue = unit === 'meters' ? 50 : 164;
    const minHeight = unit === 'meters' ? 2 : 6.5;
    const maxHeight = unit === 'meters' ? 10 : 33;

    if (!width || isNaN(widthNum) || widthNum < minValue || widthNum > maxValue) {
      newErrors.width = `Width must be between ${minValue} and ${maxValue} ${unit}`;
    }
    
    if (!length || isNaN(lengthNum) || lengthNum < minValue || lengthNum > maxValue) {
      newErrors.length = `Length must be between ${minValue} and ${maxValue} ${unit}`;
    }
    
    if (!height || isNaN(heightNum) || heightNum < minHeight || heightNum > maxHeight) {
      newErrors.height = `Height must be between ${minHeight} and ${maxHeight} ${unit}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    const dimensions: RoomDimensions = {
      width: parseFloat(width),
      length: parseFloat(length),
      height: parseFloat(height),
      unit,
    };

    setDimensions(dimensions);
    toast.success('Room dimensions saved!');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">RoomForge</span>
          </div>
          <div className="w-[72px]" /> {/* Spacer for centering */}
        </header>

        <main className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Ruler className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">Room Dimensions</h1>
            <p className="text-muted-foreground">
              Enter accurate measurements for a true-to-scale 3D model
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
            {/* Unit Toggle */}
            <div className="flex items-center justify-center gap-2 p-1 bg-secondary rounded-lg">
              <button
                type="button"
                onClick={() => setUnit('meters')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  unit === 'meters'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Meters
              </button>
              <button
                type="button"
                onClick={() => setUnit('feet')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  unit === 'feet'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Feet
              </button>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">
                Room Width
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                placeholder={`e.g., ${unit === 'meters' ? '4.5' : '15'}`}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className={errors.width ? 'border-destructive' : ''}
              />
              {errors.width && (
                <p className="text-xs text-destructive">{errors.width}</p>
              )}
            </div>

            {/* Length */}
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium">
                Room Length
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                placeholder={`e.g., ${unit === 'meters' ? '5.0' : '16'}`}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className={errors.length ? 'border-destructive' : ''}
              />
              {errors.length && (
                <p className="text-xs text-destructive">{errors.length}</p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">
                Ceiling Height
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder={`e.g., ${unit === 'meters' ? '2.8' : '9'}`}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={errors.height ? 'border-destructive' : ''}
              />
              {errors.height && (
                <p className="text-xs text-destructive">{errors.height}</p>
              )}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full group">
              Generate 3D Room
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Tip: Measure from wall to wall for the most accurate results
          </p>
        </main>
      </div>
    </div>
  );
};

export default RoomSetupForm;
