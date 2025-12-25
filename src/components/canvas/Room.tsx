import { useMemo } from 'react';
import { useRoomStore, Opening } from '@/store/roomStore';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  length: number;
  height: number;
}

// Create wall shape with cutouts for doors/windows
const createWallWithOpenings = (
  wallWidth: number,
  wallHeight: number,
  wallOpenings: Opening[]
): THREE.Shape => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(wallWidth, 0);
  shape.lineTo(wallWidth, wallHeight);
  shape.lineTo(0, wallHeight);
  shape.lineTo(0, 0);

  wallOpenings.forEach((opening) => {
    const centerX = opening.position * wallWidth;
    const halfWidth = opening.width / 2;
    const left = Math.max(0.05, centerX - halfWidth);
    const right = Math.min(wallWidth - 0.05, centerX + halfWidth);
    const bottom = opening.elevation;
    const top = Math.min(wallHeight - 0.05, opening.elevation + opening.height);

    const hole = new THREE.Path();
    hole.moveTo(left, bottom);
    hole.lineTo(right, bottom);
    hole.lineTo(right, top);
    hole.lineTo(left, top);
    hole.lineTo(left, bottom);
    shape.holes.push(hole);
  });

  return shape;
};

const Room = ({ width, length, height }: RoomProps) => {
  const { wallColors, floorColor, openings } = useRoomStore();

  const wallThickness = 0.08;

  // Group openings by wall
  const openingsByWall = useMemo(() => ({
    north: openings.filter((o) => o.wall === 'north'),
    south: openings.filter((o) => o.wall === 'south'),
    east: openings.filter((o) => o.wall === 'east'),
    west: openings.filter((o) => o.wall === 'west'),
  }), [openings]);

  // Create wall geometries with cutouts
  const walls = useMemo(() => {
    const configs = [
      {
        name: 'north' as const,
        wallWidth: width,
        position: [0, height / 2, -length / 2 - wallThickness / 2] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        openings: openingsByWall.north,
        opacity: 1,
      },
      {
        name: 'south' as const,
        wallWidth: width,
        position: [0, height / 2, length / 2 + wallThickness / 2] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        openings: openingsByWall.south,
        opacity: 0.15,
      },
      {
        name: 'west' as const,
        wallWidth: length,
        position: [-width / 2 - wallThickness / 2, height / 2, 0] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        openings: openingsByWall.west,
        opacity: 1,
      },
      {
        name: 'east' as const,
        wallWidth: length,
        position: [width / 2 + wallThickness / 2, height / 2, 0] as [number, number, number],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        openings: openingsByWall.east,
        opacity: 0.3,
      },
    ];

    return configs.map((config) => {
      const shape = createWallWithOpenings(config.wallWidth, height, config.openings);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: wallThickness,
        bevelEnabled: false,
      });
      geometry.translate(-config.wallWidth / 2, -height / 2, -wallThickness / 2);

      return { ...config, geometry };
    });
  }, [width, length, height, openingsByWall]);

  // Create door/window frames
  const frames = useMemo(() => {
    return openings.map((opening) => {
      let wallWidth: number;
      let position: [number, number, number];
      let rotation: [number, number, number];

      switch (opening.wall) {
        case 'north':
          wallWidth = width;
          position = [(opening.position - 0.5) * wallWidth, opening.elevation + opening.height / 2, -length / 2];
          rotation = [0, 0, 0];
          break;
        case 'south':
          wallWidth = width;
          position = [(opening.position - 0.5) * wallWidth, opening.elevation + opening.height / 2, length / 2];
          rotation = [0, Math.PI, 0];
          break;
        case 'west':
          wallWidth = length;
          position = [-width / 2, opening.elevation + opening.height / 2, (opening.position - 0.5) * wallWidth];
          rotation = [0, Math.PI / 2, 0];
          break;
        case 'east':
          wallWidth = length;
          position = [width / 2, opening.elevation + opening.height / 2, (opening.position - 0.5) * wallWidth];
          rotation = [0, -Math.PI / 2, 0];
          break;
        default:
          return null;
      }

      const frameColor = opening.type === 'door' ? '#5c4033' : '#4a5568';
      const frameThickness = 0.04;

      return (
        <group key={opening.id} position={position} rotation={rotation}>
          {/* Top frame */}
          <mesh position={[0, opening.height / 2 + frameThickness / 2, 0]} castShadow>
            <boxGeometry args={[opening.width + frameThickness * 2, frameThickness, 0.12]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
          {/* Bottom frame (windows only) */}
          {opening.type === 'window' && (
            <mesh position={[0, -opening.height / 2 - frameThickness / 2, 0]} castShadow>
              <boxGeometry args={[opening.width + frameThickness * 2, frameThickness, 0.12]} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
          )}
          {/* Left frame */}
          <mesh position={[-opening.width / 2 - frameThickness / 2, 0, 0]} castShadow>
            <boxGeometry args={[frameThickness, opening.height, 0.12]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
          {/* Right frame */}
          <mesh position={[opening.width / 2 + frameThickness / 2, 0, 0]} castShadow>
            <boxGeometry args={[frameThickness, opening.height, 0.12]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
          {/* Glass for windows */}
          {opening.type === 'window' && (
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[opening.width, opening.height]} />
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      );
    });
  }, [openings, width, length, height]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow name="floor">
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Floor base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[width + wallThickness * 2, 0.1, length + wallThickness * 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Walls with cutouts */}
      {walls.map((wall) => (
        <mesh
          key={wall.name}
          geometry={wall.geometry}
          position={wall.position}
          rotation={wall.rotation}
          receiveShadow
          castShadow={wall.opacity === 1}
        >
          <meshStandardMaterial
            color={wallColors[wall.name]}
            roughness={0.9}
            transparent={wall.opacity < 1}
            opacity={wall.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Door/Window frames */}
      {frames}

      {/* Ceiling edges */}
      <mesh position={[0, height, -length / 2]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[-width / 2, height, 0]}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[width / 2, height, 0]}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Baseboard */}
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
