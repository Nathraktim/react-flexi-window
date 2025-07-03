import React, { useState } from 'react';
import WindowComponent from 'react-flexi-window';

function BasicExample() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0', position: 'relative' }}>
      <WindowComponent
        w={400}
        h={300}
        x={100}
        y={100}
        minW={200}
        minH={150}
        boundary={true}
        windowColor="blue-500/20"
        windowBorderColor="blue-600/50"
        windowBorderRadius="lg"
        windowBorder={1}
        windowShadow="lg"
        windowBackgroundBlur="sm"
      >
        <div style={{ padding: '20px', height: '100%' }}>
          <h2>Basic Window Example</h2>
          <p>This is a draggable and resizable window.</p>
          <p>Try dragging the window around and resizing it!</p>
          <button 
            onClick={() => setCount(count + 1)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Count: {count}
          </button>
        </div>
      </WindowComponent>
    </div>
  );
}

export default BasicExample;
