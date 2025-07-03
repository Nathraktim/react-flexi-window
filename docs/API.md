# API Reference

## WindowComponent

A flexible, draggable, and resizable window component for React.

### Props

#### Size and Position

- **w** (`number | 'auto' | 'full'`) - Initial width
  - `number`: Width in pixels
  - `'auto'`: Automatically sized based on content
  - `'full'`: 100% width
  - Default: `'auto'`

- **h** (`number | 'auto' | 'full'`) - Initial height
  - `number`: Height in pixels
  - `'auto'`: Automatically sized based on content
  - `'full'`: 100% height
  - Default: `'auto'`

- **x** (`number`) - Initial X position in pixels
  - Default: `50`

- **y** (`number`) - Initial Y position in pixels
  - Default: `50`

- **minW** (`number`) - Minimum width in pixels
  - Default: `1`

- **minH** (`number`) - Minimum height in pixels
  - Default: `1`

- **maxW** (`number | 'viewport'`) - Maximum width
  - `number`: Maximum width in pixels
  - `'viewport'`: Constrain to viewport width
  - Default: `Infinity`

- **maxH** (`number | 'viewport'`) - Maximum height
  - `number`: Maximum height in pixels
  - `'viewport'`: Constrain to viewport height
  - Default: `Infinity`

#### Behavior

- **boundary** (`boolean`) - Constrain window to viewport
  - `true`: Window cannot be dragged outside viewport
  - `false`: Window can be dragged anywhere
  - Default: `false`

- **overflow** (`string`) - CSS overflow property
  - Default: `'auto'`

- **overflowX** (`string`) - CSS overflow-x property
  - Default: `'auto'`

- **overflowY** (`string`) - CSS overflow-y property
  - Default: `'auto'`

- **zIndex** (`number`) - Z-index value
  - Default: `1`

#### Styling

- **className** (`string`) - Additional CSS classes
  - Default: `''`

- **windowColor** (`string`) - Background color
  - Format: `'colorname-intensity/opacity'`
  - Example: `'blue-500/30'`
  - Default: `''`

- **windowBorderColor** (`string`) - Border color
  - Format: `'colorname-intensity/opacity'`
  - Example: `'blue-600/50'`
  - Default: `''`

- **windowBorderRadius** (`string`) - Border radius
  - Options: `'none'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'3xl'`, `'4xl'`, `'5xl'`, `'6xl'`, `'7xl'`, `'8xl'`, `'9xl'`, `'10xl'`, `'11xl'`, `'12xl'`, `'full'`
  - Default: `''`

- **windowBorder** (`number`) - Border width in pixels
  - Default: `0`

- **windowShadow** (`string`) - Box shadow
  - Options: `'none'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'3xl'`, `'4xl'`, `'5xl'`, `'6xl'`, `'7xl'`
  - Can include opacity: `'lg/30'`
  - Default: `''`

- **windowBackgroundBlur** (`string`) - Backdrop blur filter
  - Options: `'none'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'3xl'`, `'4xl'`, `'5xl'`, `'6xl'`, `'7xl'`
  - Default: `''`

- **windowBackgroundSaturation** (`string`) - Backdrop saturation
  - Value: `'0'` to `'200'` (percentage)
  - Default: `'100'`

#### Content

- **children** (`ReactNode`) - Child components to render inside the window
  - Default: `undefined`

## Color System

### Available Colors
- `red`: Red color variants
- `blue`: Blue color variants
- `green`: Green color variants
- `yellow`: Yellow color variants
- `purple`: Purple color variants
- `pink`: Pink color variants
- `indigo`: Indigo color variants
- `gray`: Gray color variants
- `slate`: Slate color variants
- `zinc`: Zinc color variants
- `emerald`: Emerald color variants

### Intensities
- `50`: Lightest shade
- `100`: Very light shade
- `200`: Light shade
- `300`: Light-medium shade
- `400`: Medium shade
- `500`: Base shade
- `600`: Medium-dark shade
- `700`: Dark shade
- `800`: Very dark shade
- `900`: Darkest shade

### Opacity
- Optional opacity value from 0-100
- Format: `/opacity` (e.g., `/30` for 30% opacity)
- Default: 100% opacity if not specified

### Examples
```jsx
// Blue with 30% opacity
windowColor="blue-500/30"

// Red border with 80% opacity
windowBorderColor="red-600/80"

// Emerald with full opacity (default)
windowColor="emerald-400"
```

## Interaction

### Dragging
- Click and drag the window content area to move the window
- If `boundary` is true, window will be constrained to viewport
- **Smart Element Detection**: Dragging is automatically disabled when clicking on interactive elements:
  - `INPUT`, `TEXTAREA`, `BUTTON`, `SELECT`, `A` (links)
  - Elements with `contentEditable` attribute
  - Elements inside links or buttons

### Resizing
- Drag the edges or corners of the window to resize
- Window will respect `minW`, `minH`, `maxW`, and `maxH` constraints
- Corner handles allow diagonal resizing
- Edge handles allow single-axis resizing

### Viewport Responsiveness
- Windows automatically adjust when the browser window is resized
- Size constraints are re-evaluated on viewport changes
- Position is adjusted to keep windows within boundaries (when `boundary` is enabled)

### Text Selection
- Text selection is preserved when not actively dragging or resizing
- During interactions, text selection is temporarily disabled for better UX

### Resize Handles
- **Top edge**: Resize height (cursor: n-resize)
- **Bottom edge**: Resize height (cursor: s-resize)
- **Left edge**: Resize width (cursor: w-resize)
- **Right edge**: Resize width (cursor: e-resize)
- **Top-left corner**: Resize width and height (cursor: nw-resize)
- **Top-right corner**: Resize width and height (cursor: ne-resize)
- **Bottom-left corner**: Resize width and height (cursor: sw-resize)
- **Bottom-right corner**: Resize width and height (cursor: se-resize)

## Best Practices

1. **Container Setup**: Always use a positioned container (relative/absolute) for proper window positioning
2. **Z-index Management**: Use `zIndex` prop to control window stacking order
3. **Responsive Design**: Use `maxW="viewport"` and `maxH="viewport"` for responsive behavior
4. **Boundary Constraints**: Enable `boundary` prop for better UX in confined spaces
5. **Performance**: Avoid excessive re-renders by memoizing child components if needed
6. **Interactive Content**: Place interactive elements (forms, buttons) inside windows - they work seamlessly
7. **Accessibility**: Ensure proper focus management and keyboard navigation in your window content
8. **Event Handling**: The component handles most mouse events automatically, avoid conflicting event listeners

## Advanced Usage

### Dynamic Window Management
```jsx
const [windows, setWindows] = useState([]);

const addWindow = () => {
  setWindows(prev => [...prev, { id: Date.now(), x: 50, y: 50 }]);
};

const removeWindow = (id) => {
  setWindows(prev => prev.filter(w => w.id !== id));
};
```

### Form Integration
```jsx
<WindowComponent windowColor="blue-500/20" boundary={true}>
  <form style={{ padding: '20px' }}>
    <input type="text" placeholder="Type here..." />
    <button type="submit">Submit</button>
  </form>
</WindowComponent>
```
