import { useMemo } from 'react';
import { useRoomStore } from '@/store/roomStore';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  length: number;
  height: number;
}

const Room = ({ width, length, height }: RoomProps) => {
  const { wallColors, floorColor } = useRoomStore();

  const wallThickness = 0.08;
  const wallHeight = height;

  return (
    <group>
      {/* Floor - main surface for placing objects */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.01, 0]}
        receiveShadow
        name="floor"
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color={floorColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Floor base for depth */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[width + wallThickness * 2, 0.1, length + wallThickness * 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Back Wall (North, -Z) - fully visible */}
      <mesh 
        position={[0, wallHeight / 2, -length / 2 - wallThickness / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[width + wallThickness * 2, wallHeight, wallThickness]} />
        <meshStandardMaterial 
          color={wallColors.north}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Left Wall (West, -X) - fully visible */}
      <mesh 
        position={[-width / 2 - wallThickness / 2, wallHeight / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, length]} />
        <meshStandardMaterial 
          color={wallColors.west}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Right Wall (East, +X) - semi-transparent for viewing */}
      <mesh 
        position={[width / 2 + wallThickness / 2, wallHeight / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, length]} />
        <meshStandardMaterial 
          color={wallColors.east}
          roughness={0.9}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Front Wall (South, +Z) - very transparent for camera view */}
      <mesh 
        position={[0, wallHeight / 2, length / 2 + wallThickness / 2]}
      >
        <boxGeometry args={[width + wallThickness * 2, wallHeight, wallThickness]} />
        <meshStandardMaterial 
          color={wallColors.south}
          transparent
          opacity={0.15}
          roughness={0.9}
        />
      </mesh>

      {/* Ceiling frame (just edges, no solid ceiling) */}
      {/* Back edge */}
      <mesh position={[0, wallHeight, -length / 2]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Left edge */}
      <mesh position={[-width / 2, wallHeight, 0]}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Right edge */}
      <mesh position={[width / 2, wallHeight, 0]}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Baseboard trim */}
      <mesh position={[0, 0.05, -length / 2 + 0.02]}>
        <boxGeometry args={[width, 0.1, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-width / 2 + 0.02, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.1, length]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

export default Room;
