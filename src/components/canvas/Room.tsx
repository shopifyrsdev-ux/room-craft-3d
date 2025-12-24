import { useMemo } from 'react';
import { useRoomStore } from '@/store/roomStore';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  length: number;
  height: number;
}

const Room = ({ width, length, height }: RoomProps) => {
  const { wallColors, floorColor, ceilingColor } = useRoomStore();

  // Create materials with proper colors
  const materials = useMemo(() => ({
    floor: new THREE.MeshStandardMaterial({ 
      color: floorColor,
      roughness: 0.8,
      metalness: 0.1,
    }),
    ceiling: new THREE.MeshStandardMaterial({ 
      color: ceilingColor,
      roughness: 0.9,
      metalness: 0,
      side: THREE.BackSide,
    }),
    wallNorth: new THREE.MeshStandardMaterial({ 
      color: wallColors.north,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    wallSouth: new THREE.MeshStandardMaterial({ 
      color: wallColors.south,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    wallEast: new THREE.MeshStandardMaterial({ 
      color: wallColors.east,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    wallWest: new THREE.MeshStandardMaterial({ 
      color: wallColors.west,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  }), [wallColors, floorColor, ceilingColor]);

  const wallThickness = 0.1;

  return (
    <group>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <primitive object={materials.floor} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, length]} />
        <primitive object={materials.ceiling} attach="material" />
      </mesh>

      {/* North Wall (back, -Z) */}
      <mesh 
        position={[0, height / 2, -length / 2]}
        receiveShadow
      >
        <boxGeometry args={[width, height, wallThickness]} />
        <primitive object={materials.wallNorth} attach="material" />
      </mesh>

      {/* South Wall (front, +Z) - transparent/open for viewing */}
      <mesh 
        position={[0, height / 2, length / 2]}
        receiveShadow
      >
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial 
          color={wallColors.south}
          transparent
          opacity={0.3}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* East Wall (right, +X) */}
      <mesh 
        position={[width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[length, height, wallThickness]} />
        <primitive object={materials.wallEast} attach="material" />
      </mesh>

      {/* West Wall (left, -X) */}
      <mesh 
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[length, height, wallThickness]} />
        <primitive object={materials.wallWest} attach="material" />
      </mesh>
    </group>
  );
};

export default Room;
