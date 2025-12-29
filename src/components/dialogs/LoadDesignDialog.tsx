import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Trash2, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RoomDesign {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface LoadDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (designData: unknown) => void;
}

const LoadDesignDialog = ({ open, onOpenChange, onLoad }: LoadDesignDialogProps) => {
  const [designs, setDesigns] = useState<RoomDesign[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchDesigns();
    }
  }, [open, user]);

  const fetchDesigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('room_designs')
      .select('id, name, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Failed to load designs');
    } else {
      setDesigns(data || []);
    }
    setLoading(false);
  };

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    const { data, error } = await supabase
      .from('room_designs')
      .select('design_data')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      toast.error('Failed to load design');
    } else {
      onLoad(data.design_data);
      onOpenChange(false);
      toast.success('Design loaded!');
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const { error } = await supabase
      .from('room_designs')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete design');
    } else {
      setDesigns((prev) => prev.filter((d) => d.id !== id));
      toast.success('Design deleted');
    }
    setDeletingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-panel border-glass-border">
        <DialogHeader>
          <DialogTitle>Load Design</DialogTitle>
          <DialogDescription>
            Select a saved design to load into the editor.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No saved designs yet.</p>
            <p className="text-sm">Save your first design to see it here!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{design.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Updated {format(new Date(design.updated_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(design.id, design.name)}
                      disabled={deletingId === design.id}
                    >
                      {deletingId === design.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleLoad(design.id)}
                      disabled={loadingId === design.id}
                      className="btn-glow"
                    >
                      {loadingId === design.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Load'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoadDesignDialog;
