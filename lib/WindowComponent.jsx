import { useState, useRef, useEffect, useCallback, memo } from 'react';

/**
 * Global styles component for hiding scrollbars across different browsers
 * @component
 * @returns {JSX.Element} Style element with cross-browser scrollbar hiding CSS
 */
const GlobalStyles = memo(() => (
    <style>
        {`
      /* Utility class to hide scrollbars while preserving functionality */
      .flexi-window-hide-scrollbar::-webkit-scrollbar {
        display: none; /* For Chrome, Safari, and Opera */
      }
      .flexi-window-hide-scrollbar {
        -ms-overflow-style: none;  /* For Internet Explorer and Edge */
        scrollbar-width: none;  /* For Firefox */
      }
    `}
    </style>
));

/**
 * A professional-grade, flexible window component for React applications.
 * Provides draggable and resizable functionality with comprehensive touch and mouse support.
 * 
 * @component
 * @example
 * ```jsx
 * <WindowComponent
 *   w={400}
 *   h={300}
 *   x={100}
 *   y={100}
 *   windowColor="blue-500/90"
 *   windowBorderRadius="lg"
 *   windowShadow="xl/30"
 *   boundary={true}
 * >
 *   <div>Your content here</div>
 * </WindowComponent>
 * ```
 * 
 * @param {Object} props - Component props
 * @param {number|string} [props.w='auto'] - Window width (number for pixels, 'auto', 'full', or CSS value)
 * @param {number|string} [props.h='auto'] - Window height (number for pixels, 'auto', 'full', or CSS value)
 * @param {number} [props.x=50] - Initial X position in pixels
 * @param {number} [props.y=50] - Initial Y position in pixels
 * @param {number} [props.minW=1] - Minimum width in pixels
 * @param {number} [props.minH=1] - Minimum height in pixels
 * @param {number|string} [props.maxW=Infinity] - Maximum width in pixels or 'viewport' for viewport constraint
 * @param {number|string} [props.maxH=Infinity] - Maximum height in pixels or 'viewport' for viewport constraint
 * @param {boolean} [props.boundary=false] - Whether to constrain window within viewport boundaries
 * @param {string} [props.overflow='auto'] - CSS overflow property for the content area
 * @param {string} [props.overflowY='auto'] - CSS overflow-y property for the content area
 * @param {string} [props.overflowX='auto'] - CSS overflow-x property for the content area
 * @param {boolean} [props.hideScrollbar=false] - Whether to hide scrollbars while preserving scroll functionality
 * @param {string} [props.className=''] - Additional CSS classes to apply to the window
 * @param {string} [props.windowColor=''] - Tailwind-style color (e.g., 'blue-500/90' for blue with 90% opacity)
 * @param {string} [props.windowBorderColor=''] - Border color, defaults to windowColor if not specified
 * @param {string} [props.windowBorderRadius=''] - Border radius using Tailwind-style values (sm, md, lg, xl, etc.)
 * @param {number} [props.windowBorder=0] - Border width in pixels
 * @param {string} [props.windowShadow=''] - Box shadow using Tailwind-style values with optional opacity (e.g., 'xl/30')
 * @param {string} [props.windowBackgroundBlur=''] - Backdrop blur effect (sm, md, lg, xl, etc.)
 * @param {string} [props.windowBackgroundSaturation='100'] - Backdrop saturation percentage
 * @param {number} [props.zIndex=1] - CSS z-index value for stacking order
 * @param {React.ReactNode} props.children - Content to render inside the window
 * @returns {JSX.Element} The rendered window component
 */
function WindowComponent({
    w = 'auto', h = 'auto', x = 50, y = 50, minW = 1, minH = 1, boundary = false, overflow = 'auto', overflowY = 'auto', overflowX = 'auto', maxW = Infinity, maxH = Infinity, hideScrollbar = false, className = '', windowColor = '', windowBorderColor = '', windowBorderRadius = '', windowBorder = 0, windowShadow = '', windowBackgroundBlur = '', windowBackgroundSaturation = '100', zIndex = 1, children
}) {
    // ===================== STATE MANAGEMENT =====================
    /**
     * Current position of the window
     * @type {[{x: number, y: number}, Function]}
     */
    const [position, setPosition] = useState({ x, y });
    
    /**
     * Current size of the window
     * @type {[{w: number|string, h: number|string}, Function]}
     */
    const [size, setSize] = useState({ w, h });
    
    /**
     * Whether the window is currently being interacted with (dragged or resized)
     * @type {[boolean, Function]}
     */
    const [isInteracting, setIsInteracting] = useState(false);
    
    /**
     * Current viewport dimensions for boundary calculations
     * @type {[{width: number, height: number}, Function]}
     */
    const [viewportSize, setViewportSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    // ===================== REFS =====================
    /**
     * Stores current interaction state (drag/resize details)
     * @type {React.MutableRefObject<null|{type: string, startX: number, startY: number, initialWidth: number, initialHeight: number, initialX: number, initialY: number}>}
     */
    const interactionRef = useRef(null);
    
    /**
     * Reference to the main window DOM element
     * @type {React.MutableRefObject<HTMLDivElement|null>}
     */
    const windowRef = useRef(null);
    
    /**
     * Timer for touch drag hold detection
     * @type {React.MutableRefObject<number|null>}
     */
    const dragHoldTimerRef = useRef(null);
    
    /**
     * Initial touch coordinates for movement threshold detection
     * @type {React.MutableRefObject<null|{x: number, y: number}>}
     */
    const touchStartCoordsRef = useRef(null);

    // ===================== UTILITY FUNCTIONS =====================
    /**
     * Extracts coordinates from mouse or touch events
     * @param {MouseEvent|TouchEvent} e - The event object
     * @returns {{clientX: number, clientY: number, target: EventTarget}} Normalized coordinates and target
     */
    const getEventCoordinates = (e) => {
        if (e.touches && e.touches.length > 0) return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, target: e.touches[0].target };
        return { clientX: e.clientX, clientY: e.clientY, target: e.target };
    };

    // ===================== EVENT HANDLERS =====================
    /**
     * Initiates interaction (drag or resize) when user starts mouse/touch interaction
     * @param {MouseEvent|TouchEvent} e - The initiating event
     * @param {string} type - Type of interaction ('drag', 'resize-*')
     */
    const handleInteractionStart = useCallback((e, type) => {
        const { clientX, clientY, target } = getEventCoordinates(e);
        
        // Prevent dragging on interactive elements
        if (type === 'drag') {
            const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A'];
            if (interactiveTags.includes(target.tagName) || target.isContentEditable || target.closest('a[href], button')) return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        if (!windowRef.current) return;
        const { offsetWidth, offsetHeight } = windowRef.current;
        
        // Store interaction state for movement calculations
        interactionRef.current = { 
            type, 
            startX: clientX, 
            startY: clientY, 
            initialWidth: offsetWidth, 
            initialHeight: offsetHeight, 
            initialX: position.x, 
            initialY: position.y 
        };
        setIsInteracting(true);
    }, [position]);

    /**
     * Handles mouse/touch movement during drag or resize operations
     * @param {MouseEvent|TouchEvent} e - The movement event
     */
    const handleInteractionMove = useCallback((e) => {
        if (!interactionRef.current) return;
        if (e.cancelable) e.preventDefault();
        
        const { clientX, clientY } = getEventCoordinates(e);
        const dx = clientX - interactionRef.current.startX;
        const dy = clientY - interactionRef.current.startY;
        const { type, initialX, initialY, initialWidth, initialHeight } = interactionRef.current;
        
        if (type === 'drag') {
            // Handle window dragging
            let newX = initialX + dx, newY = initialY + dy;
            if (boundary) {
                newX = Math.max(0, Math.min(newX, viewportSize.width - initialWidth));
                newY = Math.max(0, Math.min(newY, viewportSize.height - initialHeight));
            }
            setPosition({ x: newX, y: newY });
        } else if (type.startsWith('resize')) {
            // Handle window resizing
            let newWidth = initialWidth, newHeight = initialHeight, newX = initialX, newY = initialY;
            
            // Calculate new dimensions based on resize direction
            if (type.includes('right')) newWidth = initialWidth + dx;
            if (type.includes('left')) newWidth = initialWidth - dx;
            if (type.includes('bottom')) newHeight = initialHeight + dy;
            if (type.includes('top')) newHeight = initialHeight - dy;
            
            // Apply size constraints
            const effectiveMaxW = maxW === 'viewport' ? viewportSize.width : maxW;
            const effectiveMaxH = maxH === 'viewport' ? viewportSize.height : maxH;
            let constrainedW = Math.max(minW, Math.min(newWidth, effectiveMaxW));
            let constrainedH = Math.max(minH, Math.min(newHeight, effectiveMaxH));
            
            // Adjust position for left/top resizing
            if (type.includes('left')) newX = initialX + (initialWidth - constrainedW);
            if (type.includes('top')) newY = initialY + (initialHeight - constrainedH);
            
            // Apply boundary constraints
            if (boundary) {
                if (newX < 0) { constrainedW += newX; newX = 0; }
                if (newY < 0) { constrainedH += newY; newY = 0; }
                if (newX + constrainedW > viewportSize.width) { constrainedW = viewportSize.width - newX; }
                if (newY + constrainedH > viewportSize.height) { constrainedH = viewportSize.height - newY; }
                constrainedW = Math.max(minW, constrainedW);
                constrainedH = Math.max(minH, constrainedH);
            }
            
            setSize({ w: constrainedW, h: constrainedH });
            setPosition({ x: newX, y: newY });
        }
    }, [minW, minH, maxW, maxH, viewportSize, boundary]);

    /**
     * Ends the current interaction and cleans up state
     */
    const handleInteractionEnd = useCallback(() => {
        clearTimeout(dragHoldTimerRef.current);
        touchStartCoordsRef.current = null;
        interactionRef.current = null;
        setIsInteracting(false);
    }, []);

    /**
     * Cancels touch drag hold timer
     */
    const cancelDragHold = useCallback(() => {
        clearTimeout(dragHoldTimerRef.current);
        touchStartCoordsRef.current = null;
    }, []);

    /**
     * Handles touch start for drag operations with hold delay
     * @param {TouchEvent} e - Touch start event
     */
    const handleDragTouchStart = useCallback((e) => {
        touchStartCoordsRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragHoldTimerRef.current = setTimeout(() => handleInteractionStart(e, 'drag'), 200);
    }, [handleInteractionStart]);

    /**
     * Handles touch movement to detect accidental drags and cancel hold timer
     * @param {TouchEvent} e - Touch move event
     */
    const handleDragTouchMove = useCallback((e) => {
        if (!touchStartCoordsRef.current) return;
        const MOVEMENT_THRESHOLD = 10;
        const dx = Math.abs(e.touches[0].clientX - touchStartCoordsRef.current.x);
        const dy = Math.abs(e.touches[0].clientY - touchStartCoordsRef.current.y);
        if (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD) {
            cancelDragHold();
        }
    }, [cancelDragHold]);
    // ===================== EFFECTS =====================
    /**
     * Handles viewport resize events to update internal viewport size state
     */
    useEffect(() => {
        const handleResize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Ensures window stays within bounds and respects size constraints when viewport or props change
     */
    useEffect(() => {
        if (!windowRef.current) return;
        const { offsetWidth, offsetHeight } = windowRef.current;
        let newX = position.x, newY = position.y, newW = size.w, newH = size.h;
        let posNeedsUpdate = false, sizeNeedsUpdate = false;
        
        // Apply maximum size constraints
        const effectiveMaxW = maxW === 'viewport' ? viewportSize.width : maxW;
        const effectiveMaxH = maxH === 'viewport' ? viewportSize.height : maxH;
        if (typeof newW === 'number' && newW > effectiveMaxW) { newW = effectiveMaxW; sizeNeedsUpdate = true; }
        if (typeof newH === 'number' && newH > effectiveMaxH) { newH = effectiveMaxH; sizeNeedsUpdate = true; }
        
        // Apply boundary constraints
        if (boundary) {
            if (newX < 0) { newX = 0; posNeedsUpdate = true; }
            if (newY < 0) { newY = 0; posNeedsUpdate = true; }
            if (newX + offsetWidth > viewportSize.width) { newX = viewportSize.width - offsetWidth; posNeedsUpdate = true; }
            if (newY + offsetHeight > viewportSize.height) { newY = viewportSize.height - offsetHeight; posNeedsUpdate = true; }
        }
        
        if (posNeedsUpdate) setPosition({ x: newX, y: newY });
        if (sizeNeedsUpdate) setSize({ w: newW, h: newH });
    }, [viewportSize, boundary, maxW, maxH, size.w, size.h, position.x, position.y]);

    /**
     * Manages global event listeners for interaction handling
     */
    useEffect(() => {
        if (isInteracting) {
            window.addEventListener('mousemove', handleInteractionMove);
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('mouseleave', handleInteractionEnd);
            window.addEventListener('touchmove', handleInteractionMove, { passive: false });
            window.addEventListener('touchend', handleInteractionEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('mouseleave', handleInteractionEnd);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isInteracting, handleInteractionMove, handleInteractionEnd]);

    // ===================== STYLING UTILITIES =====================
    /**
     * Converts various size formats to CSS-compatible values
     * @param {number|string} v - Size value (number, 'auto', 'full', or CSS string)
     * @returns {string} CSS-compatible size value
     */
    const formatCssSize = (v) => (typeof v === 'number' ? `${v}px` : (v === 'full' ? '100%' : v));
    
    /**
     * Tailwind-compatible color mapping with RGB values
     * @constant {Object.<string, string>}
     */
    const colorMap = {'red-50': '254 242 242', 'red-100': '254 226 226', 'red-200': '252 165 165', 'red-300': '248 113 113', 'red-400': '239 68 68', 'red-500': '239 68 68', 'red-600': '220 38 38', 'red-700': '185 28 28', 'red-800': '153 27 27', 'red-900': '127 29 29', 'blue-50': '239 246 255', 'blue-100': '219 234 254', 'blue-200': '191 219 254', 'blue-300': '147 197 253', 'blue-400': '96 165 250', 'blue-500': '59 130 246', 'blue-600': '37 99 235', 'blue-700': '29 78 216', 'blue-800': '30 64 175', 'blue-900': '30 58 138', 'green-50': '240 253 244', 'green-100': '220 252 231', 'green-200': '187 247 208', 'green-300': '134 239 172', 'green-400': '74 222 128', 'green-500': '34 197 94', 'green-600': '22 163 74', 'green-700': '21 128 61', 'green-800': '22 101 52', 'green-900': '20 83 45', 'yellow-50': '254 252 232', 'yellow-100': '254 249 195', 'yellow-200': '254 240 138', 'yellow-300': '253 224 71', 'yellow-400': '250 204 21', 'yellow-500': '234 179 8', 'yellow-600': '202 138 4', 'yellow-700': '161 98 7', 'yellow-800': '133 77 14', 'yellow-900': '113 63 18', 'purple-50': '250 245 255', 'purple-100': '243 232 255', 'purple-200': '233 213 255', 'purple-300': '196 181 253', 'purple-400': '167 139 250', 'purple-500': '139 92 246', 'purple-600': '124 58 237', 'purple-700': '109 40 217', 'purple-800': '91 33 182', 'purple-900': '76 29 149', 'pink-50': '253 242 248', 'pink-100': '252 231 243', 'pink-200': '251 207 232', 'pink-300': '249 168 212', 'pink-400': '244 114 182', 'pink-500': '236 72 153', 'pink-600': '219 39 119', 'pink-700': '190 24 93', 'pink-800': '157 23 77', 'pink-900': '131 24 67', 'indigo-50': '238 242 255', 'indigo-100': '224 231 255', 'indigo-200': '199 210 254', 'indigo-300': '165 180 252', 'indigo-400': '129 140 248', 'indigo-500': '99 102 241', 'indigo-600': '79 70 229', 'indigo-700': '67 56 202', 'indigo-800': '55 48 163', 'indigo-900': '49 46 129', 'gray-50': '249 250 251', 'gray-100': '243 244 246', 'gray-200': '229 231 235', 'gray-300': '209 213 219', 'gray-400': '156 163 175', 'gray-500': '107 114 128', 'gray-600': '75 85 99', 'gray-700': '55 65 81', 'gray-800': '31 41 55', 'gray-900': '17 24 39', 'slate-50': '248 250 252', 'slate-100': '241 245 249', 'slate-200': '226 232 240', 'slate-300': '203 213 225', 'slate-400': '148 163 184', 'slate-500': '100 116 139', 'slate-600': '71 85 105', 'slate-700': '51 65 85', 'slate-800': '30 41 59', 'slate-900': '15 23 42', 'zinc-50': '250 250 250', 'zinc-100': '244 244 245', 'zinc-200': '228 228 231', 'zinc-300': '212 212 216', 'zinc-400': '161 161 170', 'zinc-500': '113 113 122', 'zinc-600': '82 82 91', 'zinc-700': '63 63 70', 'zinc-800': '39 39 42', 'zinc-900': '24 24 27', 'emerald-50': '236 253 245', 'emerald-100': '209 250 229', 'emerald-200': '167 243 208', 'emerald-300': '110 231 183', 'emerald-400': '52 211 153', 'emerald-500': '16 185 129', 'emerald-600': '5 150 105', 'emerald-700': '4 120 87', 'emerald-800': '6 95 70', 'emerald-900': '6 78 59' };
    
    /**
     * Converts Tailwind-style color notation to CSS rgba value
     * @param {string} c - Color string in format 'color-shade/opacity' (e.g., 'blue-500/90')
     * @returns {string|undefined} CSS rgba color value or undefined if no color specified
     */
    const getColorValue = (c) => { 
        if (!c) return undefined; 
        const [n, o = '100'] = c.split('/'); 
        const rgb = colorMap[n] || '107 114 128'; 
        return `rgba(${rgb.split(' ').join(', ')}, ${parseInt(o, 10) / 100})`; 
    };
    
    /**
     * Tailwind-compatible border radius mapping
     * @constant {Object.<string, string>}
     */
    const radiusMap = { 'none': '0', 'sm': '0.125rem', '': '0.25rem', 'md': '0.375rem', 'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem', '5xl': '2.5rem', '6xl': '3rem', '7xl': '3.5rem', '8xl': '4rem', '9xl': '4.5rem', '10xl': '5rem', '11xl': '5.5rem', '12xl': '6rem', 'full': '9999px' };
    
    /**
     * Converts Tailwind-style border radius to CSS value
     * @param {string} r - Border radius key from radiusMap
     * @returns {string} CSS border-radius value
     */
    const getBorderRadius = (r) => radiusMap[r] || '0.25rem';
    
    /**
     * Tailwind-compatible box shadow mapping with opacity support
     * @constant {Object.<string, Function>}
     */
    const shadowMap = { 'none': 'none', 'sm': (a) => `0 1px 2px 0 rgb(0 0 0 / ${a})`, '': (a) => `0 1px 3px 0 rgb(0 0 0 / ${a}), 0 1px 2px -1px rgb(0 0 0 / ${a * 0.1})`, 'md': (a) => `0 4px 6px -1px rgb(0 0 0 / ${a}), 0 2px 4px -2px rgb(0 0 0 / ${a * 0.1})`, 'lg': (a) => `0 10px 15px -3px rgb(0 0 0 / ${a}), 0 4px 6px -4px rgb(0 0 0 / ${a * 0.1})`, 'xl': (a) => `0 20px 25px -5px rgb(0 0 0 / ${a}), 0 8px 10px -6px rgb(0 0 0 / ${a * 0.1})`, '2xl': (a) => `0 25px 50px -12px rgb(0 0 0 / ${a})`, '3xl': (a) => `0 35px 60px -15px rgb(0 0 0 / ${a})`, '4xl': (a) => `0 45px 70px -20px rgb(0 0 0 / ${a})`, '5xl': (a) => `0 55px 80px -25px rgb(0 0 0 / ${a})`, '6xl': (a) => `0 65px 90px -30px rgb(0 0 0 / ${a})`, '7xl': (a) => `0 75px 100px -35px rgb(0 0 0 / ${a})` };
    
    /**
     * Converts Tailwind-style shadow notation to CSS box-shadow value
     * @param {string} s - Shadow string in format 'size/opacity' (e.g., 'xl/30')
     * @returns {string|undefined} CSS box-shadow value or undefined if no shadow specified
     */
    const getBoxShadow = (s) => { 
        if (!s) return undefined; 
        const [z, o = '50'] = s.split('/'); 
        const a = parseInt(o, 10) / 100; 
        return (shadowMap[z] || shadowMap[''])(a); 
    };
    
    /**
     * Tailwind-compatible blur effect mapping
     * @constant {Object.<string, string>}
     */
    const blurMap = { 'none': 'none', 'sm': 'blur(4px)', '': 'blur(8px)', 'md': 'blur(12px)', 'lg': 'blur(16px)', 'xl': 'blur(24px)', '2xl': 'blur(40px)', '3xl': 'blur(64px)', '4xl': 'blur(96px)', '5xl': 'blur(128px)', '6xl': 'blur(160px)', '7xl': 'blur(192px)' };
    
    /**
     * Creates backdrop-filter CSS value from blur and saturation settings
     * @param {string} b - Blur level key from blurMap
     * @param {string} s - Saturation percentage
     * @returns {string|undefined} CSS backdrop-filter value or undefined if no effects specified
     */
    const getBackdropFilter = (b, s) => { 
        const f = []; 
        if (b) f.push(blurMap[b] || 'blur(8px)'); 
        if (s && s !== '100') f.push(`saturate(${s}%)`); 
        return f.length ? f.join(' ') : undefined; 
    };
    // ===================== COMPUTED STYLES =====================
    /**
     * Main window container styles with all visual properties applied
     * @constant {Object}
     */
    const windowStyle = { 
        WebkitFontSmoothing: 'antialiased', 
        MozOsxFontSmoothing: 'grayscale', 
        userSelect: isInteracting ? 'none' : 'auto', 
        position: 'absolute', 
        width: formatCssSize(size.w), 
        height: formatCssSize(size.h), 
        transform: `translate(${position.x}px, ${position.y}px)`, 
        display: 'flex', 
        flexDirection: 'column', 
        zIndex: zIndex, 
        backgroundColor: getColorValue(windowColor), 
        borderColor: getColorValue(windowBorderColor || windowColor), 
        borderWidth: windowBorder ? `${windowBorder}px` : undefined, 
        borderStyle: windowBorder ? 'solid' : undefined, 
        borderRadius: windowBorderRadius ? getBorderRadius(windowBorderRadius) : undefined, 
        boxShadow: getBoxShadow(windowShadow), 
        backdropFilter: getBackdropFilter(windowBackgroundBlur, windowBackgroundSaturation) 
    };
    
    /**
     * Inner content area styles with overflow and cursor properties
     * @constant {Object}
     */
    const innerDivStyle = { 
        overflow: overflow, 
        overflowX: overflowX, 
        overflowY: overflowY, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        cursor: 'move', 
        touchAction: 'pan-y' 
    };

    // ===================== RESIZE HANDLE DEFINITIONS =====================
    /**
     * Default resize handles for desktop interaction (mouse)
     * Provides 8 resize handles: 4 edges + 4 corners
     * @constant {Array<{type: string, style: Object}>}
     */
    const defaultResizeHandles = [
        { type: 'resize-top', style: { position: 'absolute', height: '8px', width: '100%', top: '-4px', left: '0', cursor: 'n-resize', zIndex: 10 } }, 
        { type: 'resize-bottom', style: { position: 'absolute', height: '8px', width: '100%', bottom: '-4px', left: '0', cursor: 's-resize', zIndex: 10 } }, 
        { type: 'resize-left', style: { position: 'absolute', width: '8px', height: '100%', top: '0', left: '-4px', cursor: 'w-resize', zIndex: 10 } }, 
        { type: 'resize-right', style: { position: 'absolute', width: '8px', height: '100%', top: '0', right: '-4px', cursor: 'e-resize', zIndex: 10 } }, 
        { type: 'resize-top-left', style: { position: 'absolute', width: '16px', height: '16px', top: '-8px', left: '-8px', cursor: 'nw-resize', zIndex: 11 } }, 
        { type: 'resize-top-right', style: { position: 'absolute', width: '16px', height: '16px', top: '-8px', right: '-8px', cursor: 'ne-resize', zIndex: 11 } }, 
        { type: 'resize-bottom-left', style: { position: 'absolute', width: '16px', height: '16px', bottom: '-8px', left: '-8px', cursor: 'sw-resize', zIndex: 11 } }, 
        { type: 'resize-bottom-right', style: { position: 'absolute', width: '16px', height: '16px', bottom: '-8px', right: '-8px', cursor: 'se-resize', zIndex: 11 } }
    ];

    /**
     * Base style for assistive resize handles (touch-friendly)
     * @constant {Object}
     */
    const assistiveHandleStyle = { 
        position: 'absolute', 
        width: '40px', 
        height: '40px', 
        backgroundColor: 'rgba(59, 130, 246, 0.0)', 
        borderRadius: '10px', 
        zIndex: 12, 
    };
    
    /**
     * Larger resize handles for touch interaction
     * Only corner handles for better mobile UX
     * @constant {Array<{type: string, style: Object}>}
     */
    const assistiveResizeHandles = [
        { type: 'resize-top-left', style: { ...assistiveHandleStyle, top: '-20px', left: '-20px', cursor: 'nw-resize' } },
        { type: 'resize-top-right', style: { ...assistiveHandleStyle, top: '-20px', right: '-20px', cursor: 'ne-resize' } },
        { type: 'resize-bottom-left', style: { ...assistiveHandleStyle, bottom: '-20px', left: '-20px', cursor: 'sw-resize' } },
        { type: 'resize-bottom-right', style: { ...assistiveHandleStyle, bottom: '-20px', right: '-20px', cursor: 'se-resize' } },
    ];

    /**
     * Determines which resize handles to show based on interaction state
     * @constant {Array<{type: string, style: Object}>}
     */
    const activeHandles = isInteracting ? assistiveResizeHandles : defaultResizeHandles;     // ===================== COMPONENT RENDER =====================
    return (
        <div 
            ref={windowRef} 
            className={`${className} ${hideScrollbar ? 'flexi-window-hide-scrollbar' : ''}`} 
            style={windowStyle}
            role="dialog"
            aria-label="Draggable and resizable window"
        >
            <GlobalStyles />
            <div 
                className={`${hideScrollbar ? 'flexi-window-hide-scrollbar' : ''}`} 
                style={innerDivStyle} 
                onMouseDown={(e) => handleInteractionStart(e, 'drag')} 
                onTouchStart={handleDragTouchStart} 
                onTouchEnd={cancelDragHold} 
                onTouchMove={handleDragTouchMove}
                role="region"
                aria-label="Window content area"
            >
                {children}
            </div>
            {activeHandles.map(handle => (
                <div 
                    key={handle.type} 
                    style={handle.style} 
                    onMouseDown={(e) => handleInteractionStart(e, handle.type)} 
                    onTouchStart={(e) => handleInteractionStart(e, handle.type)}
                    role="button"
                    aria-label={`Resize ${handle.type.replace('resize-', '').replace('-', ' ')}`}
                    tabIndex={-1}
                />
            ))}
        </div>
    );
}

// Set display name for better debugging experience
WindowComponent.displayName = 'WindowComponent';

export default WindowComponent;