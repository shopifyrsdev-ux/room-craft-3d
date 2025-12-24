import { useRef, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useRoomStore, FurnitureItem, convertToMeters } from '@/store/roomStore';
import * as THREE from 'three';

interface FurnitureObjectProps {
  item: FurnitureItem;
  isSelected: boolean;
  onSelect: () => void;
}

// Furniture dimensions in meters (real-world scale)
const FURNITURE_DIMENSIONS: Record<FurnitureItem['type'], { width: number; height: number; depth: number }> = {
  bed: { width: 1.6, height: 0.5, depth: 2.0 },
  sofa: { width: 2.0, height: 0.8, depth: 0.9 },
  table: { width: 1.2, height: 0.75, depth: 0.8 },
  chair: { width: 0.5, height: 0.9, depth: 0.5 },
  wardrobe: { width: 1.5, height: 2.0, depth: 0.6 },
  decor: { width: 0.3, height: 0.5, depth: 0.3 },
};

const FurnitureObject = ({ item, isSelected, onSelect }: FurnitureObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const updateFurniture = useRoomStore((state) => state.updateFurniture);
  const dimensions = useRoomStore((state) => state.dimensions);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const furnitureDims = FURNITURE_DIMENSIONS[item.type];

  // Get room dimensions in meters
  const roomWidth = dimensions ? convertToMeters(dimensions.width, dimensions.unit) : 10;
  const roomLength = dimensions ? convertToMeters(dimensions.length, dimensions.unit) : 10;

  // Handle drag movement
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !e.point) return;

    // Clamp position within room bounds
    const halfWidth = roomWidth / 2 - furnitureDims.width / 2;
    const halfLength = roomLength / 2 - furnitureDims.depth / 2;

    const newX = Math.max(-halfWidth, Math.min(halfWidth, e.point.x));
    const newZ = Math.max(-halfLength, Math.min(halfLength, e.point.z));

    updateFurniture(item.id, {
      position: [newX, furnitureDims.height / 2, newZ],
    });
  };

  // Subtle hover animation
  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = hovered || isSelected ? 1.02 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group position={item.position} rotation={item.rotation}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false);
          setIsDragging(false);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[furnitureDims.width, furnitureDims.height, furnitureDims.depth]} />
        <meshStandardMaterial
          color={item.color}
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected ? item.color : '#000000'}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[
            furnitureDims.width + 0.05,
            furnitureDims.height + 0.05,
            furnitureDims.depth + 0.05,
          ]} />
          <meshBasicMaterial
            color="#f59e0b"
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureObject;
