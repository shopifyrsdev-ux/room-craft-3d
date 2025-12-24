import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LandingPage from '@/components/landing/LandingPage';
import RoomSetupForm from '@/components/room-setup/RoomSetupForm';
import DesignerView from '@/components/designer/DesignerView';
import { useRoomStore } from '@/store/roomStore';

type AppView = 'landing' | 'setup' | 'designer';

const Index = () => {
  const dimensions = useRoomStore((state) => state.dimensions);
  const [view, setView] = useState<AppView>('landing');

  // Check if there's a saved design on mount
  useEffect(() => {
    if (dimensions) {
      // If dimensions exist in storage, go directly to designer
      setView('designer');
    }
  }, []);

  const handleStart = () => {
    setView('setup');
  };

  const handleBack = () => {
    setView('landing');
  };

  const handleSetupComplete = () => {
    setView('designer');
  };

  const handleExitDesigner = () => {
    setView('landing');
  };

  return (
    <>
      <Helmet>
        <title>RoomForge - 3D Room Designer | Visualize Your Space</title>
        <meta 
          name="description" 
          content="Design your room in true-to-scale 3D before making any purchases. Add furniture, customize colors, and visualize your perfect space with RoomForge." 
        />
        <meta name="keywords" content="room designer, 3D room planner, interior design tool, furniture layout, home design" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://roomforge.app" />
      </Helmet>

      {view === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {view === 'setup' && (
        <RoomSetupForm onBack={handleBack} onComplete={handleSetupComplete} />
      )}
      
      {view === 'designer' && (
        <DesignerView onExit={handleExitDesigner} />
      )}
    </>
  );
};

export default Index;
