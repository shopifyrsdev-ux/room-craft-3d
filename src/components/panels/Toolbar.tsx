import { useRoomStore } from '@/store/roomStore';
import { Button } from '@/components/ui/button';
import { 
  Grid3X3, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Save,
  Home,
  Box,
} from 'lucide-react';
import { toast } from 'sonner';

interface ToolbarProps {
  onExit: () => void;
}

const Toolbar = ({ onExit }: ToolbarProps) => {
  const { 
    showGrid, 
    toggleGrid, 
    resetRoom,
    furniture,
    dimensions,
  } = useRoomStore();

  const handleSave = () => {
    // State is already persisted via zustand persist middleware
    toast.success('Design saved to browser storage!');
  };

  const handleReset = () => {
    if (furniture.length > 0) {
      if (confirm('Are you sure you want to reset? All furniture will be removed.')) {
        resetRoom();
        toast.info('Room reset to defaults');
      }
    } else {
      resetRoom();
      toast.info('Room reset to defaults');
    }
  };

  return (
    <div className="glass-panel px-4 py-2 flex items-center gap-2">
      {/* Logo / Exit */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onExit}
        className="gap-2 mr-4"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Box className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold">RoomForge</span>
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* Grid Toggle */}
      <Button
        variant={showGrid ? 'secondary' : 'ghost'}
        size="sm"
        onClick={toggleGrid}
        className="gap-2"
      >
        <Grid3X3 className="w-4 h-4" />
        Grid
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* Undo/Redo (placeholder for now) */}
      <Button variant="ghost" size="icon" disabled className="h-8 w-8">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled className="h-8 w-8">
        <Redo2 className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

      <div className="flex-1" />

      {/* Room Info */}
      {dimensions && (
        <div className="text-xs text-muted-foreground mr-4">
          {dimensions.width} × {dimensions.length} × {dimensions.height} {dimensions.unit}
        </div>
      )}

      {/* Save */}
      <Button
        variant="default"
        size="sm"
        onClick={handleSave}
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        Save
      </Button>
    </div>
  );
};

export default Toolbar;
