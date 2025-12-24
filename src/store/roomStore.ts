import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Unit = 'meters' | 'feet';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  unit: Unit;
}

export interface FurnitureItem {
  id: string;
  type: 'bed' | 'sofa' | 'table' | 'chair' | 'wardrobe' | 'decor';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface WallColors {
  north: string;
  south: string;
  east: string;
  west: string;
}

export interface RoomState {
  // Room setup
  dimensions: RoomDimensions | null;
  setDimensions: (dimensions: RoomDimensions) => void;
  
  // Furniture
  furniture: FurnitureItem[];
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectedFurnitureId: string | null;
  selectFurniture: (id: string | null) => void;
  
  // Colors
  wallColors: WallColors;
  setWallColor: (wall: keyof WallColors, color: string) => void;
  floorColor: string;
  setFloorColor: (color: string) => void;
  ceilingColor: string;
  setCeilingColor: (color: string) => void;
  
  // UI state
  showGrid: boolean;
  toggleGrid: () => void;
  
  // Actions
  resetRoom: () => void;
  undo: () => void;
  redo: () => void;
  history: RoomState[];
  historyIndex: number;
}

const defaultWallColors: WallColors = {
  north: '#e8e4df',
  south: '#e8e4df',
  east: '#e8e4df',
  west: '#e8e4df',
};

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      dimensions: null,
      setDimensions: (dimensions) => set({ dimensions }),
      
      furniture: [],
      addFurniture: (item) => set((state) => ({
        furniture: [...state.furniture, { ...item, id: crypto.randomUUID() }],
      })),
      updateFurniture: (id, updates) => set((state) => ({
        furniture: state.furniture.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),
      removeFurniture: (id) => set((state) => ({
        furniture: state.furniture.filter((item) => item.id !== id),
        selectedFurnitureId: state.selectedFurnitureId === id ? null : state.selectedFurnitureId,
      })),
      selectedFurnitureId: null,
      selectFurniture: (id) => set({ selectedFurnitureId: id }),
      
      wallColors: defaultWallColors,
      setWallColor: (wall, color) => set((state) => ({
        wallColors: { ...state.wallColors, [wall]: color },
      })),
      floorColor: '#8b7355',
      setFloorColor: (floorColor) => set({ floorColor }),
      ceilingColor: '#ffffff',
      setCeilingColor: (ceilingColor) => set({ ceilingColor }),
      
      showGrid: true,
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      
      resetRoom: () => set({
        dimensions: null,
        furniture: [],
        selectedFurnitureId: null,
        wallColors: defaultWallColors,
        floorColor: '#8b7355',
        ceilingColor: '#ffffff',
        showGrid: true,
      }),
      
      // Placeholder for undo/redo - simplified for MVP
      undo: () => {},
      redo: () => {},
      history: [],
      historyIndex: -1,
    }),
    {
      name: 'room-designer-storage',
      partialize: (state) => ({
        dimensions: state.dimensions,
        furniture: state.furniture,
        wallColors: state.wallColors,
        floorColor: state.floorColor,
        ceilingColor: state.ceilingColor,
      }),
    }
  )
);

// Helper to convert between units
export const convertToMeters = (value: number, unit: Unit): number => {
  return unit === 'feet' ? value * 0.3048 : value;
};

export const convertFromMeters = (value: number, unit: Unit): number => {
  return unit === 'feet' ? value / 0.3048 : value;
};
