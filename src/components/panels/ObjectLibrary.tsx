import { useRoomStore, FurnitureItem } from '@/store/roomStore';
import { Button } from '@/components/ui/button';
import { 
  Bed, 
  Sofa, 
  Table, 
  ArmchairIcon, 
  DoorClosed,
  Flower2,
} from 'lucide-react';

const FURNITURE_CATALOG: {
  type: FurnitureItem['type'];
  name: string;
  icon: React.ElementType;
  defaultColor: string;
}[] = [
  { type: 'bed', name: 'Bed', icon: Bed, defaultColor: '#4a5568' },
  { type: 'sofa', name: 'Sofa', icon: Sofa, defaultColor: '#718096' },
  { type: 'table', name: 'Table', icon: Table, defaultColor: '#8b6914' },
  { type: 'chair', name: 'Chair', icon: ArmchairIcon, defaultColor: '#5a4a3a' },
  { type: 'wardrobe', name: 'Wardrobe', icon: DoorClosed, defaultColor: '#654321' },
  { type: 'decor', name: 'Decor', icon: Flower2, defaultColor: '#2d5a27' },
];

const ObjectLibrary = () => {
  const addFurniture = useRoomStore((state) => state.addFurniture);

  const handleAddFurniture = (catalogItem: typeof FURNITURE_CATALOG[0]) => {
    addFurniture({
      type: catalogItem.type,
      name: catalogItem.name,
      position: [0, 0.25, 0], // Slightly above floor
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: catalogItem.defaultColor,
    });
  };

  return (
    <div className="glass-panel p-4 w-64 h-full overflow-y-auto">
      <h2 className="font-display text-lg font-semibold mb-4 px-1">Furniture</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {FURNITURE_CATALOG.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAddFurniture(item)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 px-1">
        <p className="text-xs text-muted-foreground">
          Click to add furniture to your room. Drag to reposition.
        </p>
      </div>
    </div>
  );
};

export default ObjectLibrary;
