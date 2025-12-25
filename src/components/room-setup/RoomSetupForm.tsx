import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoomStore, Unit, RoomDimensions, Opening } from '@/store/roomStore';
import { ArrowLeft, ArrowRight, Box, Ruler, DoorOpen, Square, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoomSetupFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const RoomSetupForm = ({ onBack, onComplete }: RoomSetupFormProps) => {
  const { setDimensions, openings, addOpening, updateOpening, removeOpening } = useRoomStore();
  
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

  const handleAddOpening = (type: 'door' | 'window') => {
    const newOpening: Opening = {
      id: crypto.randomUUID(),
      type,
      wall: 'north',
      position: 0.5,
      width: type === 'door' ? 0.9 : 1.2,
      height: type === 'door' ? 2.1 : 1.0,
      elevation: type === 'door' ? 0 : 1.0,
    };
    addOpening(newOpening);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="relative z-10 container mx-auto px-6 py-12">
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
          <div className="w-[72px]" />
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Ruler className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">Room Setup</h1>
            <p className="text-muted-foreground">Enter dimensions and add doors/windows</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
            {/* Unit Toggle */}
            <div className="flex items-center justify-center gap-2 p-1 bg-secondary rounded-lg">
              <button type="button" onClick={() => setUnit('meters')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${unit === 'meters' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Meters</button>
              <button type="button" onClick={() => setUnit('feet')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${unit === 'feet' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Feet</button>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" type="number" step="0.1" placeholder={unit === 'meters' ? '4.5' : '15'} value={width} onChange={(e) => setWidth(e.target.value)} className={errors.width ? 'border-destructive' : ''} />
                {errors.width && <p className="text-xs text-destructive">{errors.width}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input id="length" type="number" step="0.1" placeholder={unit === 'meters' ? '5.0' : '16'} value={length} onChange={(e) => setLength(e.target.value)} className={errors.length ? 'border-destructive' : ''} />
                {errors.length && <p className="text-xs text-destructive">{errors.length}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" step="0.1" placeholder={unit === 'meters' ? '2.8' : '9'} value={height} onChange={(e) => setHeight(e.target.value)} className={errors.height ? 'border-destructive' : ''} />
                {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
              </div>
            </div>

            {/* Doors & Windows */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-base">Doors & Windows</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddOpening('door')}><DoorOpen className="w-4 h-4 mr-1" />Door</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddOpening('window')}><Square className="w-4 h-4 mr-1" />Window</Button>
                </div>
              </div>
              {openings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No doors or windows added</p>
              ) : (
                <div className="space-y-3">
                  {openings.map((op) => (
                    <div key={op.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize flex items-center gap-2">{op.type === 'door' ? <DoorOpen className="w-4 h-4" /> : <Square className="w-4 h-4" />}{op.type}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOpening(op.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div><Label className="text-xs">Wall</Label>
                          <Select value={op.wall} onValueChange={(v) => updateOpening(op.id, { wall: v as Opening['wall'] })}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="north">Back</SelectItem><SelectItem value="south">Front</SelectItem><SelectItem value="east">Right</SelectItem><SelectItem value="west">Left</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div><Label className="text-xs">Position %</Label><Input type="number" min="10" max="90" className="h-8" value={Math.round(op.position * 100)} onChange={(e) => updateOpening(op.id, { position: parseInt(e.target.value) / 100 })} /></div>
                        <div><Label className="text-xs">Width</Label><Input type="number" step="0.1" min="0.3" className="h-8" value={op.width} onChange={(e) => updateOpening(op.id, { width: parseFloat(e.target.value) })} /></div>
                        <div><Label className="text-xs">{op.type === 'window' ? 'From Floor' : 'Height'}</Label><Input type="number" step="0.1" min="0" className="h-8" value={op.type === 'window' ? op.elevation : op.height} onChange={(e) => updateOpening(op.id, op.type === 'window' ? { elevation: parseFloat(e.target.value) } : { height: parseFloat(e.target.value) })} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full group">
              Generate 3D Room
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RoomSetupForm;
