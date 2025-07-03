import React from 'react';
import WindowComponent from 'react-flexi-window';

function MultipleWindowsExample() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#e5e7eb', position: 'relative' }}>
      {/* Window 1 - Blue theme */}
      <WindowComponent
        w={300}
        h={200}
        x={50}
        y={50}
        minW={150}
        minH={100}
        boundary={true}
        windowColor="blue-500/30"
        windowBorderColor="blue-600/60"
        windowBorderRadius="xl"
        windowBorder={2}
        windowShadow="xl"
        windowBackgroundBlur="md"
        zIndex={1}
      >
        <div style={{ padding: '15px', height: '100%' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>Blue Window</h3>
          <p style={{ margin: '0 0 5px 0' }}>This window has a blue theme with medium blur.</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Z-index: 1</p>
        </div>
      </WindowComponent>

      {/* Window 2 - Green theme */}
      <WindowComponent
        w={350}
        h={250}
        x={200}
        y={150}
        minW={180}
        minH={120}
        boundary={true}
        windowColor="green-500/25"
        windowBorderColor="green-600/50"
        windowBorderRadius="2xl"
        windowBorder={1}
        windowShadow="2xl"
        windowBackgroundBlur="lg"
        zIndex={2}
      >
        <div style={{ padding: '15px', height: '100%' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>Green Window</h3>
          <p style={{ margin: '0 0 5px 0' }}>This window has a green theme with large blur.</p>
          <p style={{ margin: '0 0 5px 0' }}>It also has a higher z-index.</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Z-index: 2</p>
        </div>
      </WindowComponent>

      {/* Window 3 - Purple theme */}
      <WindowComponent
        w={280}
        h={180}
        x={400}
        y={100}
        minW={150}
        minH={100}
        boundary={true}
        windowColor="purple-500/35"
        windowBorderColor="purple-600/70"
        windowBorderRadius="lg"
        windowBorder={3}
        windowShadow="lg"
        windowBackgroundBlur="sm"
        zIndex={3}
      >
        <div style={{ padding: '15px', height: '100%' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7c3aed' }}>Purple Window</h3>
          <p style={{ margin: '0 0 5px 0' }}>This window has a purple theme with small blur.</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Z-index: 3</p>
        </div>
      </WindowComponent>

      {/* Background info */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px', 
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#374151'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>💡 Try dragging and resizing the windows!</p>
        <p style={{ margin: '0' }}>Higher z-index windows appear on top.</p>
      </div>
    </div>
  );
}

export default MultipleWindowsExample;
