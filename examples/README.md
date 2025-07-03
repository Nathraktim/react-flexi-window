# Examples

This directory contains usage examples for the `react-flexi-window` component.

## Available Examples

### 1. **BasicExample.jsx** - Simple Usage
- Single window with basic styling
- Demonstrates dragging and resizing
- Interactive counter button

### 2. **MultipleWindowsExample.jsx** - Multiple Windows
- Three windows with different themes
- Z-index management
- Different blur and styling options

### 3. **AdvancedExample.jsx** - Dynamic Window Manager
- Dynamically create and remove windows
- Random positioning and sizing
- Control panel for window management

### 4. **AdvancedInteractionExample.jsx** - Interactive Elements
- Forms with inputs, textareas, and buttons
- Todo list with checkboxes and delete buttons
- Demonstrates smart interaction handling
- Shows how interactive elements work seamlessly within windows

## Running the Examples

### Option 1: Copy to Your Project
```bash
npm install react-flexi-window
```

Then copy any example file to your project and import it:

```jsx
import BasicExample from './path/to/BasicExample';

function App() {
  return <BasicExample />;
}
```

### Option 2: Clone and Run Locally
```bash
git clone https://github.com/nathraktim/react-flexi-window.git
cd react-flexi-window
npm install
npm run dev
```

## Example Usage Patterns

### Basic Window
```jsx
<WindowComponent
  w={400}
  h={300}
  x={100}
  y={100}
  boundary={true}
  windowColor="blue-500/20"
  windowBorderRadius="lg"
  windowShadow="lg"
>
  <div style={{ padding: '20px' }}>
    <h2>My Window</h2>
    <p>Content goes here!</p>
  </div>
</WindowComponent>
```

### Constrained Window
```jsx
<WindowComponent
  w={300}
  h={200}
  boundary={true}
  maxW="viewport"
  maxH="viewport"
  windowColor="green-500/25"
  windowBackgroundBlur="md"
>
  <div style={{ padding: '15px' }}>
    <h3>Constrained Window</h3>
    <p>This window stays within the viewport</p>
  </div>
</WindowComponent>
```

### Full-Screen Modal
```jsx
<WindowComponent
  w="full"
  h="full"
  x={0}
  y={0}
  windowColor="gray-900/90"
  windowBackgroundBlur="lg"
>
  <div style={{ padding: '40px', color: 'white' }}>
    <h1>Full Screen Modal</h1>
    <p>This covers the entire screen</p>
  </div>
</WindowComponent>
```

## Tips

1. **Always use a positioned container** (relative/absolute) for proper window positioning
2. **Use `boundary={true}`** to keep windows within viewport
3. **Manage z-index** for proper window stacking
4. **Use backdrop blur** for glass-like effects
5. **Set min/max constraints** for better UX
