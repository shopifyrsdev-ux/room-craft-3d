import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { useRoomStore, convertToMeters } from '@/store/roomStore';
import Room from './Room';
import FurnitureObject from './FurnitureObject';
import * as THREE from 'three';

const Scene = () => {
  const { dimensions, furniture, showGrid, selectFurniture, selectedFurnitureId } = useRoomStore();
  
  if (!dimensions) return null;

  // Convert dimensions to meters for consistent 3D rendering
  const width = convertToMeters(dimensions.width, dimensions.unit);
  const length = convertToMeters(dimensions.length, dimensions.unit);
  const height = convertToMeters(dimensions.height, dimensions.unit);

  // Camera position based on room size
  const cameraDistance = Math.max(width, length) * 1.5;
  const cameraHeight = height * 1.2;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[cameraDistance, cameraHeight, cameraDistance]}
        fov={50}
        near={0.1}
        far={1000}
      />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={Math.max(width, length) * 3}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, height / 3, 0]}
      />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        position={[width, height * 2, length]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-width}
        shadow-camera-right={width}
        shadow-camera-top={length}
        shadow-camera-bottom={-length}
      />
      
      {/* Fill light from opposite direction */}
      <directionalLight
        position={[-width, height, -length]}
        intensity={0.3}
      />

      {/* Point light in center of room */}
      <pointLight
        position={[0, height - 0.5, 0]}
        intensity={0.5}
        distance={Math.max(width, length) * 2}
      />

      {/* Room structure */}
      <Room width={width} length={length} height={height} />

      {/* Furniture items */}
      {furniture.map((item) => (
        <FurnitureObject
          key={item.id}
          item={item}
          isSelected={selectedFurnitureId === item.id}
          onSelect={() => selectFurniture(item.id)}
        />
      ))}

      {/* Grid helper */}
      {showGrid && (
        <Grid
          position={[0, 0.001, 0]}
          args={[width * 2, length * 2]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#404040"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#606060"
          fadeDistance={Math.max(width, length) * 2}
          fadeStrength={1}
          followCamera={false}
        />
      )}
    </>
  );
};

const RoomCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gradient-to-b from-background to-secondary/20 rounded-lg overflow-hidden"
    >
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onPointerMissed={() => useRoomStore.getState().selectFurniture(null)}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default RoomCanvas;
