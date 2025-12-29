import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SaveDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void>;
  loading: boolean;
}

const SaveDesignDialog = ({ open, onOpenChange, onSave, loading }: SaveDesignDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSave(name.trim());
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel border-glass-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save Design</DialogTitle>
            <DialogDescription>
              Give your room design a name to save it to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="design-name">Design Name</Label>
            <Input
              id="design-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Living Room"
              className="mt-2"
              autoFocus
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="btn-glow">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Design
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDesignDialog;
