import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useRoomStore, FurnitureItem, convertToMeters } from '@/store/roomStore';
import * as THREE from 'three';

interface FurnitureObjectProps {
  item: FurnitureItem;
  isSelected: boolean;
  onSelect: () => void;
  roomBounds: { width: number; length: number };
}

// Realistic furniture components
const BedModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Mattress */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.6, 0.25, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Bed frame */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.7, 0.2, 2.1]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.6, -0.95]} castShadow>
        <boxGeometry args={[1.7, 0.8, 0.08]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Pillows */}
      <mesh position={[-0.4, 0.45, -0.7]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.45, -0.7]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[[-0.75, 0, -0.95], [0.75, 0, -0.95], [-0.75, 0, 0.95], [0.75, 0, 0.95]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const SofaModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.0, 0.4, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.55, -0.35]} castShadow>
        <boxGeometry args={[2.0, 0.5, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.95, 0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.95, 0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.5, 0.45, 0.05]} castShadow>
        <boxGeometry args={[0.8, 0.12, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.45, 0.05]} castShadow>
        <boxGeometry args={[0.8, 0.12, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[[-0.85, 0, 0.3], [0.85, 0, 0.3], [-0.85, 0, -0.3], [0.85, 0, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const TableModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Legs */}
      {[[-0.55, 0.35, -0.35], [0.55, 0.35, -0.35], [-0.55, 0.35, 0.35], [0.55, 0.35, 0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const ChairModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.18, 0.22, -0.18], [0.18, 0.22, -0.18], [-0.18, 0.22, 0.18], [0.18, 0.22, 0.18]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const WardrobeModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.5, 2.0, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Door line */}
      <mesh position={[0, 1, 0.301]} castShadow>
        <boxGeometry args={[0.02, 1.9, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.1, 1, 0.32]} castShadow>
        <boxGeometry args={[0.03, 0.15, 0.02]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 1, 0.32]} castShadow>
        <boxGeometry args={[0.03, 0.15, 0.02]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.52, 0.1, 0.62]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

const DecorModel = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Plant */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.55, 0.05]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.08, 0.5, -0.05]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
};

const FURNITURE_MODELS: Record<FurnitureItem['type'], React.FC<{ color: string }>> = {
  bed: BedModel,
  sofa: SofaModel,
  table: TableModel,
  chair: ChairModel,
  wardrobe: WardrobeModel,
  decor: DecorModel,
};

const FurnitureObject = ({ item, isSelected, onSelect, roomBounds }: FurnitureObjectProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const updateFurniture = useRoomStore((state) => state.updateFurniture);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const FurnitureModel = FURNITURE_MODELS[item.type];

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    // Get intersection with floor plane
    const point = e.point;
    if (!point) return;

    // Clamp within room bounds with margin
    const margin = 0.3;
    const halfWidth = roomBounds.width / 2 - margin;
    const halfLength = roomBounds.length / 2 - margin;

    const newX = Math.max(-halfWidth, Math.min(halfWidth, point.x));
    const newZ = Math.max(-halfLength, Math.min(halfLength, point.z));

    updateFurniture(item.id, {
      position: [newX, 0, newZ],
    });
  };

  // Hover effect
  useFrame(() => {
    if (!groupRef.current) return;
    const targetScale = hovered || isSelected ? 1.02 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group 
      ref={groupRef}
      position={item.position} 
      rotation={item.rotation}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setHovered(false);
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <FurnitureModel color={item.color} />
      
      {/* Selection indicator - glowing ring on floor */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.8, 0.9, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureObject;
