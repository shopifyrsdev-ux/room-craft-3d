import RoomCanvas from '@/components/canvas/RoomCanvas';
import ObjectLibrary from '@/components/panels/ObjectLibrary';
import PropertiesPanel from '@/components/panels/PropertiesPanel';
import Toolbar from '@/components/panels/Toolbar';

interface DesignerViewProps {
  onExit: () => void;
}

const DesignerView = ({ onExit }: DesignerViewProps) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex-shrink-0 p-3">
        <Toolbar onExit={onExit} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-3 p-3 pt-0 min-h-0">
        {/* Left Panel - Object Library */}
        <div className="flex-shrink-0">
          <ObjectLibrary />
        </div>

        {/* Center - 3D Canvas */}
        <div className="flex-1 min-w-0">
          <RoomCanvas />
        </div>

        {/* Right Panel - Properties */}
        <div className="flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
};

export default DesignerView;
