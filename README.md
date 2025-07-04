# React Flexi Window

A flexible, draggable, and resizable window component for React with zero dependencies.

## Features

- 🖱️ **Draggable**: Click and drag to move windows around
- 📏 **Resizable**: Drag edges and corners to resize windows
- 🎯 **Assistive Resize Handles**: Large, visible corner handles appear during interaction for enhanced usability
- 🔒 **Boundary constraints**: Optionally confine windows to viewport
- 🎨 **Customizable styling**: Built-in color themes and effects
- 📱 **Responsive**: Adapts to viewport changes automatically
- 🚀 **Zero dependencies**: No external dependencies except React
- 💨 **Lightweight**: Small bundle size
- 🔧 **TypeScript support**: Full TypeScript definitions included
- 🎯 **Smart interactions**: Respects interactive elements (buttons, inputs, etc.)
- ⚡ **Performance optimized**: Uses efficient event handling and callbacks

## Installation

```bash
npm install react-flexi-window
```

## Basic Usage

```jsx
import React from 'react';
import WindowComponent from 'react-flexi-window';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <WindowComponent
        w={400}
        h={300}
        x={100}
        y={100}
        windowColor="blue-500/20"
        windowBorderColor="blue-600/50"
        windowBorderRadius="lg"
        windowBorder={1}
        windowShadow="lg"
        boundary={true}
      >
        <div style={{ padding: '20px' }}>
          <h2>My Window</h2>
          <p>This is a draggable and resizable window!</p>
        </div>
      </WindowComponent>
    </div>
  );
}
```

## Props

### Size and Position Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `w` | `number \| 'auto' \| 'full'` | `'auto'` | Initial width in pixels, 'auto', or 'full' (100%) |
| `h` | `number \| 'auto' \| 'full'` | `'auto'` | Initial height in pixels, 'auto', or 'full' (100%) |
| `x` | `number` | `50` | Initial X position |
| `y` | `number` | `50` | Initial Y position |
| `minW` | `number` | `1` | Minimum width in pixels |
| `minH` | `number` | `1` | Minimum height in pixels |
| `maxW` | `number \| 'viewport'` | `Infinity` | Maximum width in pixels, or 'viewport' to constrain to browser window |
| `maxH` | `number \| 'viewport'` | `Infinity` | Maximum height in pixels, or 'viewport' to constrain to browser window |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `boundary` | `boolean` | `false` | If true, restricts dragging and position to within the viewport |
| `overflow` | `string` | `'auto'` | CSS overflow property |
| `overflowX` | `string` | `'auto'` | CSS overflow-x property |
| `overflowY` | `string` | `'auto'` | CSS overflow-y property |
| `zIndex` | `number` | `1` | Z-index value |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `windowColor` | `string` | `''` | Background color (format: 'colorname-intensity/opacity') |
| `windowBorderColor` | `string` | `''` | Border color |
| `windowBorderRadius` | `string` | `''` | Border radius |
| `windowBorder` | `number` | `0` | Border width in pixels |
| `windowShadow` | `string` | `''` | Box shadow |
| `windowBackgroundBlur` | `string` | `''` | Backdrop blur filter |
| `windowBackgroundSaturation` | `string` | `'100'` | Backdrop saturation |

## Color System

The component uses a built-in color system with the following format: `colorname-intensity/opacity`

### Available Colors
- `red`, `blue`, `green`, `yellow`, `purple`, `pink`, `indigo`, `gray`, `slate`, `zinc`, `emerald`

### Intensities
- `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

### Opacity (optional)
- Any number from 0-100 (e.g., `/20` for 20% opacity)

### Examples
```jsx
windowColor="blue-500/30"        // Blue with 30% opacity
windowBorderColor="red-600/80"   // Red border with 80% opacity
windowColor="emerald-400"        // Emerald with 100% opacity (default)
```

## Border Radius Options

- `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`, `10xl`, `11xl`, `12xl`, `full`

## Shadow Options

- `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`
- Can include opacity: `lg/30` for large shadow with 30% opacity

## Blur Options

- `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`

## Examples

### Multiple Windows
```jsx
<div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
  <WindowComponent
    w={300} h={200} x={50} y={50}
    windowColor="blue-500/30"
    windowBorderRadius="xl"
    windowShadow="xl"
    zIndex={1}
  >
    <div style={{ padding: '15px' }}>
      <h3>Window 1</h3>
    </div>
  </WindowComponent>
  
  <WindowComponent
    w={350} h={250} x={200} y={150}
    windowColor="green-500/25"
    windowBorderRadius="2xl"
    windowShadow="2xl"
    zIndex={2}
  >
    <div style={{ padding: '15px' }}>
      <h3>Window 2</h3>
    </div>
  </WindowComponent>
</div>
```

### Constrained Window
```jsx
<WindowComponent
  w={400}
  h={300}
  boundary={true}
  maxW="viewport"
  maxH="viewport"
  windowColor="purple-500/20"
  windowBorderColor="purple-600/50"
  windowBorderRadius="lg"
  windowBorder={2}
  windowShadow="lg"
  windowBackgroundBlur="md"
>
  <div style={{ padding: '20px' }}>
    <h2>Constrained Window</h2>
    <p>This window cannot be dragged outside the viewport.</p>
  </div>
</WindowComponent>
```

### Full-Screen Window
```jsx
<WindowComponent
  w="full"
  h="full"
  x={0}
  y={0}
  windowColor="gray-900/95"
  windowBackgroundBlur="lg"
>
  <div style={{ padding: '20px', color: 'white' }}>
    <h2>Full Screen Window</h2>
    <p>This window takes up the full screen.</p>
  </div>
</WindowComponent>
```

### Interactive Content Example
```jsx
<WindowComponent
  w={400}
  h={300}
  boundary={true}
  windowColor="blue-500/20"
  windowBorderRadius="lg"
>
  <form style={{ padding: '20px' }}>
    <input type="text" placeholder="Enter text..." />
    <button type="submit">Submit</button>
    <textarea placeholder="Your message..."></textarea>
  </form>
</WindowComponent>
```

## TypeScript Support

The component includes full TypeScript definitions:

```typescript
import WindowComponent, { WindowComponentProps } from 'react-flexi-window';

const MyWindow: React.FC<WindowComponentProps> = (props) => {
  return <WindowComponent {...props} />;
};
```

## Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+

## Behavior Details

### Smart Interaction Handling
- **Interactive Elements**: The component automatically prevents dragging when clicking on interactive elements like buttons, inputs, textareas, links, and contentEditable elements
- **Assistive Resize Handles**: During window interaction, large 40x40px corner handles appear to make resizing easier, especially on touch devices
- **Viewport Responsiveness**: Windows automatically adjust their position and size when the browser window is resized
- **Boundary Enforcement**: When `boundary={true}`, windows are constrained both during dragging and when the viewport changes
- **Text Selection**: Text selection is preserved when not interacting with the window

### Resize Handle Behavior
- **Default State**: Invisible 8px resize handles around edges and corners for clean appearance
- **During Interaction**: Large, visible 40px corner handles appear for enhanced usability
- **Touch-Friendly**: Larger handles provide better touch target areas on mobile devices

### Performance Optimizations
- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Efficient event listener management (adds/removes based on interaction state)
- Minimal DOM updates during dragging and resizing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
