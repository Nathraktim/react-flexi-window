import React, { useState } from 'react';
import WindowComponent from 'react-flexi-window';

function AdvancedExample() {
  const [windows, setWindows] = useState([
    { id: 1, x: 100, y: 100, w: 300, h: 200, color: 'blue-500/20', title: 'Window 1' },
    { id: 2, x: 200, y: 150, w: 350, h: 250, color: 'green-500/20', title: 'Window 2' }
  ]);

  const addWindow = () => {
    const newWindow = {
      id: Date.now(),
      x: 50 + Math.random() * 300,
      y: 50 + Math.random() * 200,
      w: 280 + Math.random() * 200,
      h: 180 + Math.random() * 150,
      color: `${['red', 'blue', 'green', 'purple', 'pink', 'yellow'][Math.floor(Math.random() * 6)]}-500/25`,
      title: `Window ${windows.length + 1}`
    };
    setWindows([...windows, newWindow]);
  };

  const removeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f3f4f6', position: 'relative' }}>
      {/* Control Panel */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Control Panel</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
          Windows: {windows.length}
        </p>
        <button 
          onClick={addWindow}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
            fontSize: '14px'
          }}
        >
          Add Window
        </button>
        <button 
          onClick={() => setWindows([])}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Clear All
        </button>
      </div>

      {/* Dynamic Windows */}
      {windows.map((window, index) => (
        <WindowComponent
          key={window.id}
          w={window.w}
          h={window.h}
          x={window.x}
          y={window.y}
          minW={200}
          minH={150}
          boundary={true}
          windowColor={window.color}
          windowBorderColor={window.color.replace('/20', '/50').replace('/25', '/60')}
          windowBorderRadius="lg"
          windowBorder={1}
          windowShadow="lg"
          windowBackgroundBlur="md"
          zIndex={index + 1}
        >
          <div style={{ padding: '15px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: '0', fontSize: '16px' }}>{window.title}</h3>
              <button 
                onClick={() => removeWindow(window.id)}
                style={{ 
                  padding: '4px 8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
              Position: ({Math.round(window.x)}, {Math.round(window.y)})
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
              Size: {window.w} × {window.h}
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
              Color: {window.color}
            </p>
            <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
              Try dragging and resizing this window!
            </p>
          </div>
        </WindowComponent>
      ))}

      {/* Instructions */}
      {windows.length === 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <h2>Advanced Window Manager</h2>
          <p>Click "Add Window" to create new windows</p>
        </div>
      )}
    </div>
  );
}

export default AdvancedExample;
